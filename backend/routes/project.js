const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const { uploadToIPFS } = require('../utils/ipfs');

const router = express.Router();

// ── Multer config for photo uploads ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|heic/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
    }
  },
});

// ─────────────────────────────────────────────────────────
// POST /api/projects  — Submit a new restoration project
// ─────────────────────────────────────────────────────────
router.post(
  '/',
  auth,
  upload.array('photos', 5), // Max 5 photos
  [
    body('projectName').trim().notEmpty().withMessage('Project name is required'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
    body('areaHectares').isFloat({ min: 0.01 }).withMessage('Area must be at least 0.01 hectares'),
    body('ecosystemType')
      .optional()
      .isIn(['mangrove', 'seagrass', 'salt_marsh', 'coastal_wetland', 'other']),
  ],
  async (req, res) => {
    try {
      // Validate
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const {
        projectName,
        description,
        latitude,
        longitude,
        accuracy,
        state,
        district,
        village,
        coastalZone,
        areaHectares,
        species, // JSON string: [{"name":"Avicennia marina","count":500}]
        ecosystemType,
        plantingDate,
        sequestrationRate,
        isOfflineSubmission,
      } = req.body;

      // Parse species if it's a JSON string
      let parsedSpecies = [];
      if (species) {
        try {
          parsedSpecies = typeof species === 'string' ? JSON.parse(species) : species;
        } catch (e) {
          parsedSpecies = [{ name: species, count: 0 }];
        }
      }

      // Upload photos to IPFS
      const photoRecords = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const ipfsResult = await uploadToIPFS(file.path, file.originalname);
            photoRecords.push({
              filename: file.filename,
              originalName: file.originalname,
              ipfsHash: ipfsResult.ipfsHash,
              ipfsUrl: ipfsResult.ipfsUrl,
              photoType: 'plantation',
            });
          } catch (ipfsError) {
            console.warn(`IPFS upload failed for ${file.originalname}, storing locally:`, ipfsError.message);
            // Store locally even if IPFS fails
            photoRecords.push({
              filename: file.filename,
              originalName: file.originalname,
              ipfsHash: 'pending',
              ipfsUrl: `/uploads/${file.filename}`,
              photoType: 'plantation',
            });
          }
        }
      }

      // Create project (use new + save to ensure pre-save hooks run)
      const project = new Project({
        projectName,
        description,
        submittedBy: req.user.id,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          accuracy: accuracy ? parseFloat(accuracy) : undefined,
          state,
          district,
          village,
          coastalZone,
        },
        restoration: {
          areaHectares: parseFloat(areaHectares),
          species: parsedSpecies,
          ecosystemType: ecosystemType || 'mangrove',
          plantingDate: plantingDate ? new Date(plantingDate) : undefined,
        },
        carbon: {
          sequestrationRate: sequestrationRate ? parseFloat(sequestrationRate) : 15,
        },
        photos: photoRecords,
        status: 'SUBMITTED',
        statusHistory: [
          {
            status: 'SUBMITTED',
            changedBy: req.user.id,
            remarks: 'Initial project submission',
          },
        ],
        isOfflineSubmission: isOfflineSubmission === 'true' || isOfflineSubmission === true,
      });

      await project.save();

      // Populate submittedBy for response
      await project.populate('submittedBy', 'name email role organization');

      res.status(201).json({
        success: true,
        message: `Project "${projectName}" submitted successfully! Estimated CO₂e: ${project.carbon.estimatedCO2e} tons`,
        data: { project },
      });
    } catch (error) {
      console.error('Project Submission Error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during project submission',
      });
    }
  }
);

// ─────────────────────────────────────────────────────────
// GET /api/projects  — Get all projects for logged-in user
// ─────────────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { submittedBy: req.user.id };
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('submittedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Fetch Projects Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching projects',
    });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/projects/:id  — Get single project details
// ─────────────────────────────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      submittedBy: req.user.id,
    }).populate('submittedBy', 'name email role organization');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error('Fetch Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching project',
    });
  }
});

// ─────────────────────────────────────────────────────────
// PUT /api/projects/:id  — Update draft project
// ─────────────────────────────────────────────────────────
router.put('/:id', auth, upload.array('photos', 5), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      submittedBy: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only allow editing if DRAFT or REJECTED
    if (!['DRAFT', 'REJECTED'].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot edit project with status: ${project.status}`,
      });
    }

    // Update allowed fields
    const updateFields = [
      'projectName', 'description', 'state', 'district', 'village',
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (['state', 'district', 'village'].includes(field)) {
          project.location[field] = req.body[field];
        } else {
          project[field] = req.body[field];
        }
      }
    });

    if (req.body.latitude) project.location.latitude = parseFloat(req.body.latitude);
    if (req.body.longitude) project.location.longitude = parseFloat(req.body.longitude);
    if (req.body.areaHectares) project.restoration.areaHectares = parseFloat(req.body.areaHectares);
    if (req.body.ecosystemType) project.restoration.ecosystemType = req.body.ecosystemType;

    // Handle new photo uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const ipfsResult = await uploadToIPFS(file.path, file.originalname);
          project.photos.push({
            filename: file.filename,
            originalName: file.originalname,
            ipfsHash: ipfsResult.ipfsHash,
            ipfsUrl: ipfsResult.ipfsUrl,
            photoType: 'plantation',
          });
        } catch (ipfsError) {
          project.photos.push({
            filename: file.filename,
            originalName: file.originalname,
            ipfsHash: 'pending',
            ipfsUrl: `/uploads/${file.filename}`,
            photoType: 'plantation',
          });
        }
      }
    }

    project.status = 'SUBMITTED';
    project.statusHistory.push({
      status: 'SUBMITTED',
      changedBy: req.user.id,
      remarks: 'Project resubmitted after edits',
    });

    await project.save();
    await project.populate('submittedBy', 'name email role');

    res.json({
      success: true,
      message: 'Project updated and resubmitted successfully',
      data: { project },
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating project',
    });
  }
});

module.exports = router;
