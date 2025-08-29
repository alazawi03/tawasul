const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Memorial = require('../models/Memorial');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file upload - updated to handle multiple files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('فقط الصور مسموحة'), false);
    }
  }
});

// @route   POST /api/memorial/submit
// @desc    Submit a new memorial form (supports multiple categories)
// @access  Public
router.post('/submit', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cprPhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      status,
      gender,
      age,
      deathDateHijri,
      deathDateGregorian,
      burialLocation,
      burialTimeType,
      burialTimeValue,
      condolenceLocation,
      condolenceLocationMen,
      condolenceLocationWomen,
      condolenceTimesMen,
      condolenceTimesWomen,
      contactNumbers,
      relatives,
      bloodType,
      personalId,
      donationLocation,
      donationTimes,
      donorsNeeded,
      preferredGender,
      maleDonatorsCount,
      femaleDonatorsCount,
      familyName,
      deceasedName,
      patientName
    } = req.body;

    // Validate category
    const validCategories = ['death_announcement', 'blood_donation', 'condolence_thanks', 'prayer_request'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        message: 'نوع الطلب غير صحيح'
      });
    }

    // Category-specific validation
    if (category === 'death_announcement') {
      // Death announcement validation - added gender requirement
      if (!name || !gender || !deathDateGregorian || !burialLocation || !burialTimeType || !burialTimeValue) {
        return res.status(400).json({
          message: 'جميع الحقول المطلوبة يجب ملؤها لإعلان الوفاة'
        });
      }

      // Skip CPR photo validation for development
      // TODO: Re-enable when Cloudinary is properly configured
      // if (!req.files || !req.files.cprPhoto || !req.files.cprPhoto[0]) {
      //   return res.status(400).json({
      //     message: 'صورة البطاقة الشخصية مطلوبة لإعلان الوفاة'
      //   });
      // }
    } else if (category === 'blood_donation') {
      // Blood donation validation
      if (!name || !bloodType || !donationLocation) {
        return res.status(400).json({
          message: 'الاسم، فصيلة الدم، ومكان التبرع مطلوبان'
        });
      }

      // Parse blood types (can be multiple)
      const bloodTypesArray = typeof bloodType === 'string' ? [bloodType] : bloodType;
      const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      
      for (const type of bloodTypesArray) {
        if (!validBloodTypes.includes(type)) {
          return res.status(400).json({
            message: 'فصيلة الدم غير صحيحة: ' + type
          });
        }
      }

      // Contact numbers are now optional for blood donation
      // No validation needed

      // Validate mixed gender preference counts
      if (preferredGender === 'mixed' && donorsNeeded) {
        const maleCount = parseInt(maleDonatorsCount || 0);
        const femaleCount = parseInt(femaleDonatorsCount || 0);
        const totalCount = parseInt(donorsNeeded);
        
        if (maleCount + femaleCount !== totalCount) {
          return res.status(400).json({
            message: `مجموع عدد الذكور والإناث (${maleCount + femaleCount}) يجب أن يساوي العدد الكلي للمتبرعين المطلوب (${totalCount})`
          });
        }
      }
    } else if (category === 'condolence_thanks') {
      // Condolence thanks validation
      if (!familyName || !deceasedName) {
        return res.status(400).json({
          message: 'اسم العائلة واسم المتوفى مطلوبان لرسالة الشكر'
        });
      }
    } else if (category === 'prayer_request') {
      // Prayer request validation
      if (!patientName) {
        return res.status(400).json({
          message: 'اسم المريض مطلوب لطلب الدعاء'
        });
      }
    }

    // Validate gender field for death announcements
    if (category === 'death_announcement' && gender && !['ذكر', 'انثى'].includes(gender)) {
      return res.status(400).json({
        message: 'الجنس غير صحيح'
      });
    }

    // Parse contact numbers if provided (now optional for all categories)
    let parsedContactNumbers = [];
    if (contactNumbers) {
      try {
        parsedContactNumbers = typeof contactNumbers === 'string' 
          ? JSON.parse(contactNumbers) 
          : contactNumbers;
      } catch (error) {
        return res.status(400).json({
          message: 'خطأ في تنسيق أرقام التواصل'
        });
      }
    }

    // Parse relatives if provided (optional for death announcements)
    let parsedRelatives = [];
    if (relatives) {
      try {
        parsedRelatives = typeof relatives === 'string' 
          ? JSON.parse(relatives) 
          : relatives;
      } catch (error) {
        return res.status(400).json({
          message: 'خطأ في تنسيق أنساب المتوفى'
        });
      }
    }

    // Contact numbers are now optional for all categories

    // Upload photos to Cloudinary (disabled for development)
    let photoUrl = '';
    let cprPhotoUrl = '';

    // Check if Cloudinary is properly configured
    const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                                   process.env.CLOUDINARY_API_KEY && 
                                   process.env.CLOUDINARY_API_SECRET &&
                                   process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
                                   process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
                                   process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    console.log('Cloudinary configured:', isCloudinaryConfigured);
    console.log('Environment check:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT_SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET'
    });

    // Upload CPR photo (only if Cloudinary is configured)
    if (category === 'death_announcement' && req.files?.cprPhoto?.[0] && isCloudinaryConfigured) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'islamic_memorial/cpr_photos',
              transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.files.cprPhoto[0].buffer);
        });
        cprPhotoUrl = result.secure_url;
      } catch (error) {
        console.error('CPR photo upload error:', error);
        // In development, we'll continue without photo upload
        console.log('Development mode: Skipping photo upload due to Cloudinary configuration');
      }
    }

    // Upload regular photo (only if Cloudinary is configured)
    if (category === 'death_announcement' && req.files?.photo?.[0] && isCloudinaryConfigured) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'islamic_memorial/profile_photos',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.files.photo[0].buffer);
        });
        photoUrl = result.secure_url;
      } catch (error) {
        console.error('Profile photo upload error:', error);
        // In development, we'll continue without photo upload
        console.log('Development mode: Skipping photo upload due to Cloudinary configuration');
      }
    }

    // Prepare memorial data based on category
    const memorialData = {
      category,
      name: name.trim(),
      submitterIP: req.ip || req.connection.remoteAddress
    };

    // Add category-specific fields
    if (category === 'death_announcement') {
      // Description is now optional, status is optional text field
      if (description) memorialData.description = description.trim();
      if (status) memorialData.personStatus = status.trim();
      memorialData.gender = gender;
      if (age) memorialData.age = parseInt(age);
      memorialData.deathDate = {
        hijri: deathDateHijri,
        gregorian: deathDateGregorian
      };
      memorialData.burialLocation = burialLocation;
      memorialData.burialTime = {
        type: burialTimeType,
        value: burialTimeValue
      };
      if (condolenceLocation) {
        memorialData.condolenceLocation = condolenceLocation.trim();
      }
      if (condolenceLocationMen) {
        memorialData.condolenceLocationMen = condolenceLocationMen.trim();
      }
      if (condolenceLocationWomen) {
        memorialData.condolenceLocationWomen = condolenceLocationWomen.trim();
      }
      
      // Add condolence times
      if (condolenceTimesMen) {
        try {
          const parsedTimesMen = JSON.parse(condolenceTimesMen);
          memorialData.condolenceTimesMen = parsedTimesMen;
        } catch (error) {
          console.error('Error parsing condolence times for men:', error);
        }
      }
      
      if (condolenceTimesWomen) {
        try {
          const parsedTimesWomen = JSON.parse(condolenceTimesWomen);
          memorialData.condolenceTimesWomen = parsedTimesWomen;
        } catch (error) {
          console.error('Error parsing condolence times for women:', error);
        }
      }
      if (cprPhotoUrl) memorialData.cprPhotoUrl = cprPhotoUrl;
      if (photoUrl) memorialData.photoUrl = photoUrl;
    } else if (category === 'blood_donation') {
      // Parse blood types (can be multiple)
      const bloodTypesArray = typeof bloodType === 'string' ? [bloodType] : bloodType;
      memorialData.bloodType = bloodTypesArray;
      
      // Add blood donation specific fields
      if (personalId) memorialData.personalId = personalId.trim();
      memorialData.donationLocation = donationLocation.trim();
      if (donationTimes) memorialData.donationTimes = donationTimes.trim();
      if (donorsNeeded) memorialData.donorsNeeded = parseInt(donorsNeeded);
      
      // Add gender preference fields
      if (preferredGender) {
        memorialData.preferredGender = preferredGender;
        if (preferredGender === 'mixed') {
          if (maleDonatorsCount) memorialData.maleDonatorsCount = parseInt(maleDonatorsCount);
          if (femaleDonatorsCount) memorialData.femaleDonatorsCount = parseInt(femaleDonatorsCount);
        }
      }
    } else if (category === 'condolence_thanks') {
      memorialData.familyName = familyName.trim();
      memorialData.deceasedName = deceasedName.trim();
    } else if (category === 'prayer_request') {
      memorialData.patientName = patientName.trim();
    }

    // Add contact numbers if provided
    if (parsedContactNumbers.length > 0) {
      memorialData.contactNumbers = parsedContactNumbers;
    }

    // Add relatives if provided
    if (parsedRelatives.length > 0) {
      memorialData.relatives = parsedRelatives;
    }

    // Create new memorial entry
    const memorial = new Memorial(memorialData);
    await memorial.save();

    // Success response based on category
    let successMessage = '';
    if (category === 'death_announcement') {
      successMessage = 'تم إرسال تبليغ الوفاة بنجاح. سيتم مراجعته من قبل الإدارة.';
    } else if (category === 'blood_donation') {
      successMessage = 'تم إرسال طلب التبرع بالدم بنجاح.';
    } else if (category === 'condolence_thanks') {
      successMessage = 'تم إرسال رسالة الشكر بنجاح.';
    } else if (category === 'prayer_request') {
      successMessage = 'تم إرسال طلب الدعاء بنجاح. جعله الله في ميزان حسناتكم.';
    }

    res.status(201).json({
      success: true,
      message: successMessage,
      memorial: {
        id: memorial._id,
        category: memorial.category,
        name: memorial.name,
        submittedAt: memorial.submittedAt
      }
    });

  } catch (error) {
    console.error('Memorial submission error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'رقم البطاقة الشخصية مسجل مسبقاً'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: errorMessages.join(', ')
      });
    }
    
    res.status(500).json({
      message: 'حدث خطأ في الخادم'
    });
  }
});

// @route   GET /api/memorial/calendar-options
// @desc    Get calendar date options for the form
// @access  Public
router.get('/calendar-options', (req, res) => {
  try {
    // Generate date options for the current year and next few years
    const currentYear = new Date().getFullYear();
    const hijriYear = currentYear - 622; // Approximate Hijri year
    
    const gregorianDates = [];
    const hijriDates = [];

    // Generate last 30 days and next 7 days
    for (let i = -30; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      gregorianDates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    }

    // Generate Hijri months for current year
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    hijriMonths.forEach((month, index) => {
      for (let day = 1; day <= 30; day++) {
        hijriDates.push({
          value: `${day}/${index + 1}/${hijriYear}`,
          label: `${day} ${month} ${hijriYear}هـ`
        });
      }
    });

    res.json({
      gregorian: gregorianDates,
      hijri: hijriDates.slice(0, 100) // Limit to prevent too many options
    });

  } catch (error) {
    console.error('Calendar options error:', error);
    res.status(500).json({
      message: 'حدث خطأ في جلب خيارات التاريخ'
    });
  }
});

module.exports = router;
