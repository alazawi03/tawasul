import React, { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment-hijri";
import html2canvas from "html2canvas";
import IslamicDeadPreview from "./previews/islamicPrev_v2";
import DeathAnnouncementForm from "./forms/DeathAnnouncementForm";
import CondolenceThanksForm from "./forms/CondolenceThanksForm";
import PrayerRequestForm from "./forms/PrayerRequestForm";
import BloodDonationForm from "./forms/BloodDonationForm";
import PrayerTimeForm from "./forms/PrayerTimeForm";
import {
  prayerOptions,
  burialLocations,
  bloodTypes,
  genderOptions,
  categories,
  getRelationshipOptions,
} from "../constants";

import {
  useContactNumbers,
  useRelatives,
  useCondolenceTimes,
  useFormValidation,
  useMemorialFormState,
  useFormLocalStorage,
} from "../hooks";

const MemorialForm = ({ onCategoryChange }) => {
  const methods = useForm();
  const { handleSubmit, watch, setValue } = methods;

  // Custom hooks for state management
  const contactNumbersHook = useContactNumbers();
  const relativesHook = useRelatives();
  const condolenceTimesHook = useCondolenceTimes();
  const formValidation = useFormValidation();
  const formState = useMemorialFormState();

  // localStorage functionality
  const { saveFormData, loadFormData, clearFormData, hasSavedData } =
    useFormLocalStorage("main", formState.selectedCategory);

  // State for showing restore prompt
  const [showRestorePrompt, setShowRestorePrompt] = React.useState(false);
  const [savedData, setSavedData] = React.useState(null);
  const [hasRestoredData, setHasRestoredData] = React.useState(false);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Destructure for easier access
  const {
    contactNumbers,
    showContactHours,
    addContactNumber,
    removeContactNumber,
    updateContactNumber,
    toggleContactHours,
    initializeContactNumbers,
    setContactNumbers,
    setShowContactHours,
  } = contactNumbersHook;

  const {
    relatives,
    addRelative,
    removeRelative,
    updateRelative,
    addNameToRelative,
    removeNameFromRelative,
    updateRelativeName,
    setRelatives,
  } = relativesHook;

  const {
    condolenceTimesMen,
    condolenceTimesWomen,
    addCondolenceTime,
    removeCondolenceTime,
    updateCondolenceTime,
    addTimeRange,
    removeTimeRange,
    updateTimeRange,
    setCondolenceTimesMen,
    setCondolenceTimesWomen,
  } = condolenceTimesHook;

  const {
    validateCondolenceTimes,
    validateDeathAnnouncement,
    validateBloodDonation,
    // Inline validation functions
    validateNameInline,
    validateCprInline,
    validateAgeInline,
    validatePhoneInline,
    validateGenderInline,
    validateRelationshipInline,
    validateContactNameInline,
    validateRelativeNameInline,
    validateLocationInline,
  } = formValidation;

  const {
    loading,
    setLoading,
    burialTimeType,
    setBurialTimeType,
    selectedCategory,
    selectedBloodTypes,
    setSelectedBloodTypes,
    preferredGender,
    setPreferredGender,
    showGenderDetails,
    setShowGenderDetails,
    templateData,
    setTemplateData,
    skipBurialDetails,
    setSkipBurialDetails,
    burialCompleted,
    setBurialCompleted,
    toggleBloodType,
    handleCategoryChange: handleCategoryChangeHook,
  } = formState;

  // Ref for the preview component to capture as image
  const previewRef = useRef(null);

  // Font size control state
  const [topContentFontSizeIncrease, setTopContentFontSizeIncrease] =
    React.useState(() => {
      // Get responsive default value based on screen size
      const screenWidth = window.innerWidth;
      if (screenWidth <= 500) return -20; // Extra small (xs)
      if (screenWidth <= 768) return -15; // Small (sm)
      if (screenWidth <= 1024) return 0; // Medium (md)
      return 20; // Large (lg)
    });

  // Additional content font size control for death announcements
  const [
    additionalContentFontSizeIncrease,
    setAdditionalContentFontSizeIncrease,
  ] = React.useState(() => {
    // Get responsive default value based on screen size
    const screenWidth = window.innerWidth;
    if (screenWidth <= 500) return -18; // Extra small (xs)
    if (screenWidth <= 768) return -12; // Small (sm)
    if (screenWidth <= 1024) return -5; // Medium (md)
    return 10; // Large (lg)
  });

  // Blood Donation Font Size Control (Single Unified Control)
  const [bloodDonationFontSizeIncrease, setBloodDonationFontSizeIncrease] =
    React.useState(() => {
      // Get responsive default value based on screen size
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) return -18; // Extra small mobile
      if (screenWidth <= 768) return -12; // Small tablets
      if (screenWidth <= 1024) return -5; // Medium screens
      return 10; // Large screens
    });

  const watchBurialTimeType = watch("burialTimeType");

  // Function to download the memorial preview as PNG
  const downloadMemorialImage = async () => {
    if (!previewRef.current) {
      toast.error("لا يمكن العثور على المحتوى للتحميل");
      return;
    }

    try {
      setLoading(true);

      const cardClassMap = {
        death_announcement: ".islamic-dead-card",
        blood_donation: ".blood-donation-card",
        condolence_thanks: ".condolence-thanks-card",
        prayer_request: ".prayer-request-card",
        prayer_times: ".prayer-times-card",
      };

      const cardSelector = cardClassMap[selectedCategory] || ".preview-card";
      const cardElement = previewRef.current.querySelector(cardSelector);


      // Find the islamic-dead-card element specifically

      if (!cardElement) {
        toast.error("لا يمكن العثور على بطاقة التذكار للتحميل");
        setLoading(false);
        return;
      }

      // Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait for any images to load within the card
      const images = cardElement.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete && img.naturalWidth > 0) {
            return Promise.resolve();
          }
          return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(), 3000);
            img.onload = () => {
              clearTimeout(timeout);
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timeout);
              resolve();
            };
          });
        })
      );

      // Force a reflow and wait a bit for rendering
      // eslint-disable-next-line no-unused-expressions
      cardElement.offsetHeight;
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simplified html2canvas configuration
      let canvas;
      try {
        canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: true, // Enable logging to see errors
          imageTimeout: 10000,
          removeContainer: true,
          foreignObjectRendering: false,
          // Ignore errors and continue
          onError: function (error) {
            console.warn("html2canvas warning:", error);
            return true; // Continue rendering
          },
          // Simple styling preservation
          onclone: function (clonedDoc) {
            try {
              const clonedCard = clonedDoc.querySelector(".islamic-dead-card");
              if (clonedCard) {
                // Copy important CSS custom properties
                const rootStyles = window.getComputedStyle(
                  document.documentElement
                );
                const widthScaling =
                  rootStyles.getPropertyValue("--width-scaling") || "1";
                const heightScaling =
                  rootStyles.getPropertyValue("--height-scaling") || "1";

                clonedDoc.documentElement.style.setProperty(
                  "--width-scaling",
                  widthScaling
                );
                clonedDoc.documentElement.style.setProperty(
                  "--height-scaling",
                  heightScaling
                );

                // Ensure basic styling is preserved
                clonedCard.style.fontFamily = "inherit";
                clonedCard.style.fontSize = "inherit";
                clonedCard.style.lineHeight = "inherit";

                // Copy important fonts
                const fontFaces = document.fonts;
                if (fontFaces) {
                  fontFaces.forEach((font) => {
                    if (font.status === "loaded") {
                      clonedDoc.fonts.add(font);
                    }
                  });
                }
              }
            } catch (err) {
              console.warn("Error in onclone:", err);
            }
            return clonedDoc;
          },
        });
      } catch (canvasError) {
        console.warn(
          "الطريقة الأولى فشلت، جاري المحاولة بطريقة بديلة...",
          canvasError
        );

        // Try simpler configuration as fallback
        canvas = await html2canvas(cardElement, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          removeContainer: true,
        });
      }

      // Verify canvas dimensions and content
      console.log("Canvas created:", canvas.width + "x" + canvas.height);

      // Check canvas is valid
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("فشل في إنشاء Canvas صالح");
      }

      // Check if canvas has any content by sampling pixels
      let hasContent = false;
      try {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(
          0,
          0,
          Math.min(100, canvas.width),
          Math.min(100, canvas.height)
        );
        hasContent = Array.from(imageData.data).some((pixel, index) => {
          // Check if it's not just white pixels (255,255,255,255)
          if (index % 4 === 3) return false; // Skip alpha channel
          return pixel !== 255;
        });
      } catch (err) {
        console.warn("تعذر فحص محتوى Canvas:", err);
        hasContent = true; // Assume it has content if we can't check
      }

      console.log("Canvas has visible content:", hasContent);

      if (!hasContent) {
        console.warn("Canvas appears to be blank!");
        // Try to capture again with different settings
        toast.warning("المحتوى قد يكون فارغاً. جاري المحاولة مرة أخرى...");
      }

      // Convert canvas to blob with high quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("Generated blob size:", blob.size);

            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            // Generate filename based on category and content
            let filename = "تواصل_البحرين";
            const timestamp = new Date().toISOString().slice(0, 10);

            if (selectedCategory === "death_announcement") {
              const deceasedName = templateData.name || "تبليغ_وفاة";
              filename = `${deceasedName}_${timestamp}`;
            } else if (selectedCategory === "blood_donation") {
              const donorName = templateData.name || "تبرع_دم";
              filename = `تبرع_${donorName}_${timestamp}`;
            } else if (selectedCategory === "condolence_thanks") {
              const familyName = templateData.familyName || "شكر_تعزية";
              filename = `شكر_${familyName}_${timestamp}`;
            } else if (selectedCategory === "prayer_request") {
              filename = `طلب_دعاء_${timestamp}`;
            } else if (selectedCategory === "prayer_times") {
              filename = `مواقيت_الصلاة_${timestamp}`;
            }

            link.download = `${filename}.png`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            if (hasContent) {
              toast.success("تم تحميل الصورة بنجاح");
            } else {
              toast.warning(
                "تم تحميل الصورة ولكن قد تكون فارغة. تأكد من ملء البيانات المطلوبة."
              );
            }
          } else {
            toast.error("حدث خطأ في إنشاء الصورة");
          }
        },
        "image/png",
        1.0 // Maximum quality
      );
    } catch (error) {
      console.error("خطأ في تحميل الصورة:", error);

      // تحديد نوع الخطأ وإظهار رسالة مناسبة
      let errorMessage = "حدث خطأ أثناء تحميل الصورة";

      if (error.name === "SecurityError") {
        errorMessage = "خطأ أمني: تأكد من صحة الصور المرفوعة";
      } else if (error.message && error.message.includes("Canvas")) {
        errorMessage =
          "فشل في إنشاء الصورة. تأكد من ملء جميع البيانات المطلوبة";
      } else if (error.message && error.message.includes("timeout")) {
        errorMessage = "انتهت مهلة التحميل. حاول مرة أخرى";
      } else if (error.message && error.message.includes("network")) {
        errorMessage = "خطأ في الشبكة. تحقق من اتصال الإنترنت";
      }

      toast.error(errorMessage);
      console.error("تفاصيل الخطأ:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-save form data every 3 seconds when user is typing
  React.useEffect(() => {
    const subscription = watch((data) => {
      // Debounce the save operation
      const timeoutId = setTimeout(() => {
        if (selectedCategory) {
          const formDataToSave = {
            formData: data,
            contactNumbers,
            relatives,
            condolenceTimesMen,
            condolenceTimesWomen,
            selectedBloodTypes,
            preferredGender,
            showGenderDetails,
            skipBurialDetails,
            burialCompleted,
            selectedCategory,
          };
          saveFormData(formDataToSave);
        }
      }, 3000); // Save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [
    watch,
    selectedCategory,
    contactNumbers,
    relatives,
    condolenceTimesMen,
    condolenceTimesWomen,
    selectedBloodTypes,
    preferredGender,
    showGenderDetails,
    skipBurialDetails,
    burialCompleted,
    saveFormData,
  ]);

  // Check for saved data only on initial load
  React.useEffect(() => {
    const checkForSavedData = () => {
      // Only check for saved data on initial load and if we haven't already handled it
      if (
        isInitialLoad &&
        !showRestorePrompt &&
        !hasRestoredData &&
        hasSavedData()
      ) {
        const data = loadFormData();
        if (data && data.selectedCategory === selectedCategory) {
          setSavedData(data);
          setShowRestorePrompt(true);
        }
      }
      // Mark that initial load check is complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    };

    checkForSavedData();
  }, [
    selectedCategory,
    hasSavedData,
    loadFormData,
    showRestorePrompt,
    hasRestoredData,
    isInitialLoad,
  ]);

  // Watch individual fields instead of the entire form to prevent infinite loops
  const watchedName = watch("name");
  const watchedStatus = watch("status");
  const watchedGender = watch("gender");
  const watchedAge = watch("age");
  const watchedDeathDateHijri = watch("deathDateHijri");
  const watchedDeathDateGregorian = watch("deathDateGregorian");
  const watchedBurialLocation = watch("burialLocation");
  const watchedCustomBurialLocation = watch("customBurialLocation");
  const watchedBurialTimeType = watch("burialTimeType");
  const watchedBurialTimeValue = watch("burialTimeValue");
  const watchedGraveNumber = watch("graveNumber");
  const watchedGraveSection = watch("graveSection");
  const watchedCondolenceLocationMen = watch("condolenceLocationMen");
  const watchedCondolenceLocationWomen = watch("condolenceLocationWomen");
  const watchedPhoto = watch("photo");
  const watchedFamilyName = watch("familyName");
  const watchedDeceasedName = watch("deceasedName");

  useEffect(() => {
    if (watchBurialTimeType) {
      setBurialTimeType(watchBurialTimeType);
    }
  }, [watchBurialTimeType, setBurialTimeType]);

  // Update template data when form data changes
  useEffect(() => {
    if (selectedCategory === "death_announcement") {
      // Handle burial location - use custom location if "خارج البحرين" is selected
      const burialLocation =
        watchedBurialLocation === "خارج البحرين"
          ? watchedCustomBurialLocation || ""
          : watchedBurialLocation || "";

      setTemplateData({
        name: watchedName || "",
        status: watchedStatus || "",
        gender: watchedGender || "",
        age: watchedAge || "",
        deathDateHijri: watchedDeathDateHijri || "",
        deathDateGregorian: watchedDeathDateGregorian || "",
        burialLocation: burialLocation,
        customBurialLocation: watchedCustomBurialLocation || "",
        burialTimeType: watchedBurialTimeType || "",
        burialTimeValue: watchedBurialTimeValue || "",
        graveNumber: watchedGraveNumber || "",
        graveSection: watchedGraveSection || "",
        condolenceLocationMen: watchedCondolenceLocationMen || "",
        condolenceLocationWomen: watchedCondolenceLocationWomen || "",
        condolenceTimesMen: condolenceTimesMen,
        condolenceTimesWomen: condolenceTimesWomen,
        contactNumbers: contactNumbers,
        relatives: relatives,
        photo: watchedPhoto || null, // Add photo data
        skipBurialDetails: skipBurialDetails, // Add skipBurialDetails state
        burialCompleted: burialCompleted, // Add burialCompleted state
      });
    } else if (selectedCategory === "condolence_thanks") {
      // Handle condolence thanks template data
      setTemplateData({
        familyName: watchedFamilyName || "",
        deceasedName: watchedDeceasedName || "",
      });
    }
  }, [
    watchedName,
    watchedStatus,
    watchedGender,
    watchedAge,
    watchedDeathDateHijri,
    watchedDeathDateGregorian,
    watchedBurialLocation,
    watchedCustomBurialLocation,
    watchedBurialTimeType,
    watchedBurialTimeValue,
    watchedGraveNumber,
    watchedGraveSection,
    watchedCondolenceLocationMen,
    watchedCondolenceLocationWomen,
    watchedPhoto,
    watchedFamilyName,
    watchedDeceasedName,
    contactNumbers,
    relatives,
    selectedCategory,
    condolenceTimesMen,
    condolenceTimesWomen,
    skipBurialDetails,
    burialCompleted,
    setTemplateData,
  ]);

  // Notify parent about initial category
  useEffect(() => {
    if (onCategoryChange) {
      onCategoryChange(selectedCategory);
    }
  }, [onCategoryChange, selectedCategory]);

  const gender = watch("gender");
  const relationshipOptions = getRelationshipOptions(gender);

  const handleCategoryChange = (categoryId) => {
    handleCategoryChangeHook(
      categoryId,
      onCategoryChange,
      initializeContactNumbers
    );
  };

  // Restore saved form data
  const restoreSavedData = () => {
    if (savedData) {
      // Restore form fields
      if (savedData.formData) {
        Object.keys(savedData.formData).forEach((key) => {
          if (
            savedData.formData[key] !== undefined &&
            savedData.formData[key] !== null
          ) {
            setValue(key, savedData.formData[key]);
          }
        });
      }

      // Restore state arrays
      if (savedData.contactNumbers) setContactNumbers(savedData.contactNumbers);
      if (savedData.relatives) setRelatives(savedData.relatives);
      if (savedData.condolenceTimesMen)
        setCondolenceTimesMen(savedData.condolenceTimesMen);
      if (savedData.condolenceTimesWomen)
        setCondolenceTimesWomen(savedData.condolenceTimesWomen);
      if (savedData.selectedBloodTypes)
        setSelectedBloodTypes(savedData.selectedBloodTypes);
      if (savedData.preferredGender)
        setPreferredGender(savedData.preferredGender);
      if (savedData.showGenderDetails !== undefined)
        setShowGenderDetails(savedData.showGenderDetails);
      if (savedData.skipBurialDetails !== undefined)
        setSkipBurialDetails(savedData.skipBurialDetails);
      if (savedData.burialCompleted !== undefined)
        setBurialCompleted(savedData.burialCompleted);

      // Hide the restore prompt and clear saved data reference
      setShowRestorePrompt(false);
      setSavedData(null);
      setHasRestoredData(true);
      toast.success("تم استعادة البيانات المحفوظة بنجاح");
    }
  };

  // Dismiss restore prompt and clear saved data
  const dismissRestorePrompt = () => {
    setShowRestorePrompt(false);
    clearFormData();
    setSavedData(null);
    setHasRestoredData(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);

      if (selectedCategory === "death_announcement") {
        // Use validation hook
        if (!validateDeathAnnouncement(data, relatives, contactNumbers)) {
          setLoading(false);
          return;
        }

        // Validate condolence times only if they are provided (optional)
        const hasCondolenceLocationMen = data.condolenceLocationMen?.trim();
        const hasCondolenceLocationWomen = data.condolenceLocationWomen?.trim();

        // Only validate condolence times if they are actually provided
        if (
          (hasCondolenceLocationMen && condolenceTimesMen.length > 0) ||
          (hasCondolenceLocationWomen && condolenceTimesWomen.length > 0)
        ) {
          if (
            !validateCondolenceTimes(condolenceTimesMen, condolenceTimesWomen)
          ) {
            setLoading(false);
            return;
          }
        }

        // Death announcement data
        formData.append("name", data.name);
        formData.append("status", data.status || "");
        formData.append("gender", data.gender);
        formData.append("age", data.age || "");
        formData.append("cprNumber", data.cprNumber);
        formData.append("reporterMobile", data.reporterMobile);

        // Auto-calculate Hijri date if not provided
        let hijriDate = data.deathDateHijri;
        if (!hijriDate && data.deathDateGregorian) {
          hijriDate = moment(data.deathDateGregorian).format("iYYYY/iM/iD");
        }

        formData.append("deathDateGregorian", data.deathDateGregorian);
        formData.append("deathDateHijri", hijriDate);

        // Handle burial location - use custom location if "خارج البحرين" is selected
        const burialLocation =
          data.burialLocation === "خارج البحرين"
            ? data.customBurialLocation
            : data.burialLocation;
        formData.append("burialLocation", burialLocation);
        formData.append("burialTimeType", data.burialTimeType || "manual");
        formData.append("burialTimeValue", data.burialTimeValue || "");

        if (data.condolenceLocationMen)
          formData.append("condolenceLocationMen", data.condolenceLocationMen);
        if (data.condolenceLocationWomen)
          formData.append(
            "condolenceLocationWomen",
            data.condolenceLocationWomen
          );

        if (condolenceTimesMen.length > 0) {
          formData.append(
            "condolenceTimesMen",
            JSON.stringify(condolenceTimesMen)
          );
        }
        if (condolenceTimesWomen.length > 0) {
          formData.append(
            "condolenceTimesWomen",
            JSON.stringify(condolenceTimesWomen)
          );
        }

        if (contactNumbers.length > 0) {
          formData.append("contactNumbers", JSON.stringify(contactNumbers));
        }
        if (relatives.length > 0) {
          formData.append("relatives", JSON.stringify(relatives));
        }

        // Photo uploads
        if (data.photo && data.photo[0]) {
          formData.append("photo", data.photo[0]);
        }
        formData.append("cprPhoto", data.cprPhoto[0]);
      } else if (selectedCategory === "blood_donation") {
        // Use validation hook
        if (
          !validateBloodDonation(
            data,
            selectedBloodTypes,
            contactNumbers,
            preferredGender
          )
        ) {
          setLoading(false);
          return;
        }

        // Blood donation data
        formData.append("name", data.name);
        formData.append("reporterNumber", data.reporterNumber);
        formData.append("bloodType", JSON.stringify(selectedBloodTypes));
        formData.append("donationLocation", data.donationLocation);

        // Optional fields
        if (data.personalId) formData.append("personalId", data.personalId);
        if (data.donationTimes)
          formData.append("donationTimes", data.donationTimes);
        if (data.donorsNeeded)
          formData.append("donorsNeeded", data.donorsNeeded);

        // Gender preferences (optional)
        if (preferredGender) {
          formData.append("preferredGender", preferredGender);
          if (preferredGender === "mixed") {
            if (data.maleDonatorsCount)
              formData.append("maleDonatorsCount", data.maleDonatorsCount);
            if (data.femaleDonatorsCount)
              formData.append("femaleDonatorsCount", data.femaleDonatorsCount);
          }
        }

        // Contact numbers with optional contact hours (only if provided)
        if (contactNumbers.length > 0) {
          const processedContacts = contactNumbers.map((contact) => ({
            phone: contact.phone,
            relationship: "متبرع", // Default relationship for blood donation
            contactHours: contact.contactHours || "",
          }));
          formData.append("contactNumbers", JSON.stringify(processedContacts));
        }
      } else if (selectedCategory === "condolence_thanks") {
        // Thanks data
        formData.append("familyName", data.familyName);
        formData.append("deceasedName", data.deceasedName);
      } else if (selectedCategory === "prayer_request") {
        // Prayer request data
        formData.append("patientName", data.patientName);
      } else if (selectedCategory === "prayer_times") {
        // Prayer times data - no form data needed as it's just a viewer
        formData.append("category", "prayer_times");
      }

      // Since backend is removed, we'll simulate successful submission
      // In a real implementation, you would integrate with your preferred backend service

      // Store form data locally for demonstration
      const submissionData = {
        category: selectedCategory,
        timestamp: new Date().toISOString(),
        formData: Object.fromEntries(formData.entries()),
      };

      // Save to localStorage for demonstration
      const existingSubmissions = JSON.parse(
        localStorage.getItem("memorial_submissions") || "[]"
      );
      existingSubmissions.push(submissionData);
      localStorage.setItem(
        "memorial_submissions",
        JSON.stringify(existingSubmissions)
      );

      let successMessage = "";
      if (selectedCategory === "death_announcement") {
        successMessage =
          "تم إرسال تبليغ الوفاة بنجاح. سيتم مراجعته من قبل الإدارة.";
      } else if (selectedCategory === "blood_donation") {
        successMessage = "تم إرسال طلب التبرع بالدم بنجاح.";
      } else if (selectedCategory === "condolence_thanks") {
        successMessage = "تم إرسال رسالة الشكر بنجاح.";
      } else if (selectedCategory === "prayer_request") {
        successMessage = "تم إرسال طلب الدعاء بنجاح. شافاكم الله و عافاكم.";
      } else if (selectedCategory === "prayer_times") {
        successMessage = "تم تحميل مواقيت الصلاة بنجاح.";
      }

      toast.success(successMessage);
      // Clear saved data on successful submission
      clearFormData();
      // Reset form
      window.location.reload();
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get available relationship options for a specific relative index
  const getAvailableRelationshipOptions = (currentIndex) => {
    // Get selected gender from form data
    const gender = methods.getValues("gender");
    // Count how many times "الزوج" is already used (excluding current)
    const spouseCount = relatives.filter(
      (r, i) => r.relationship === "الزوج" && i !== currentIndex
    ).length;
    // Collect all used relationships except "أخرى" and except the current relative
    const used = relatives
      .map((r, i) => (i !== currentIndex ? r.relationship : null))
      .filter((r) => r && r !== "أخرى");
    // Only allow each relationship once, except "أخرى" and "الزوج" (special logic)
    return relationshipOptions.filter((opt) => {
      if (opt === "أخرى") return true;
      if (opt === "الزوج") {
        if (gender === "ذكر") {
          // Allow up to 4 spouses for males
          return spouseCount < 4;
        } else if (gender === "انثى") {
          // All-ow only 1 spouse for females
          return spouseCount < 1;
        } else {
          // If gender not selected, allow by default
          return true;
        }
      }
      return !used.includes(opt);
    });
  };

  return (
    <div className="islamic-container">
      <div className="form-container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-arabic-title text-islamic-green mb-4 flex justify-center">
            تواصل أهل{" "}
            <span className="text-[#c40000] flex justify-center items-center text-nowrap mr-1">
              البحرين
              <img
                src="/bahrain_flag.png"
                className="w-[40px] mr-2"
                alt="bahrain_flag"
              />
            </span>
          </h2>
          <p className="text-[--secondary-color] text-[40px]">
            اختر نوع الطلب المناسب
          </p>
          <div className="islamic-divider"></div>
        </div>

        {/* Restore Data Prompt */}
        {showRestorePrompt && savedData && (
          <div className="mb-6 p-4 bg-[#fef9c3] border border-[#ccc78d]-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#333]-900 mb-2">
                  📋 تم العثور على بيانات محفوظة
                </h3>
                <p className="text-[#333]-700 mb-3">
                  لديك بيانات محفوظة من جلسة سابقة. هل تريد استعادتها؟
                </p>
                <p className="text-sm text-[#333]-600">
                  آخر حفظ:{" "}
                  {savedData.timestamp
                    ? new Date(savedData.timestamp).toLocaleString("ar-BH")
                    : "غير معروف"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={restoreSavedData}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-900 transition-colors"
              >
                ✅ استعادة البيانات
              </button>
              <button
                type="button"
                onClick={dismissRestorePrompt}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-900 transition-colors"
              >
                ❌ بدء جديد
              </button>
            </div>
          </div>
        )}

        {/* Category Selection */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${selectedCategory === category.id
                  ? "border-islamic-gold bg-islamic-gold/10 text-islamic-green"
                  : "border-gray-300 hover:border-islamic-gold/50"
                  }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-arabic-title font-bold">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Components based on selected category */}
            {selectedCategory === "death_announcement" && (
              <DeathAnnouncementForm
                contactNumbers={contactNumbers}
                setContactNumbers={setContactNumbers}
                relatives={relatives}
                setRelatives={setRelatives}
                burialTimeType={burialTimeType}
                setBurialTimeType={setBurialTimeType}
                condolenceTimesMen={condolenceTimesMen}
                setCondolenceTimesMen={setCondolenceTimesMen}
                condolenceTimesWomen={condolenceTimesWomen}
                setCondolenceTimesWomen={setCondolenceTimesWomen}
                skipBurialDetails={skipBurialDetails}
                setSkipBurialDetails={setSkipBurialDetails}
                burialCompleted={burialCompleted}
                setBurialCompleted={setBurialCompleted}
                relationshipOptions={getAvailableRelationshipOptions}
                burialLocations={burialLocations}
                genderOptions={genderOptions}
                prayerOptions={prayerOptions}
                addContactNumber={addContactNumber}
                removeContactNumber={removeContactNumber}
                updateContactNumber={updateContactNumber}
                addRelative={addRelative}
                removeRelative={removeRelative}
                updateRelative={updateRelative}
                addNameToRelative={addNameToRelative}
                removeNameFromRelative={removeNameFromRelative}
                updateRelativeName={updateRelativeName}
                addCondolenceTime={addCondolenceTime}
                removeCondolenceTime={removeCondolenceTime}
                updateCondolenceTime={updateCondolenceTime}
                addTimeRange={addTimeRange}
                removeTimeRange={removeTimeRange}
                updateTimeRange={updateTimeRange}
                // Inline validation functions
                validateNameInline={validateNameInline}
                validateCprInline={validateCprInline}
                validateAgeInline={validateAgeInline}
                validatePhoneInline={validatePhoneInline}
                validateGenderInline={validateGenderInline}
                validateRelationshipInline={validateRelationshipInline}
                validateContactNameInline={validateContactNameInline}
                validateRelativeNameInline={validateRelativeNameInline}
                validateLocationInline={validateLocationInline}
                topContentFontSizeIncrease={topContentFontSizeIncrease}
                setTopContentFontSizeIncrease={setTopContentFontSizeIncrease}
                additionalContentFontSizeIncrease={
                  additionalContentFontSizeIncrease
                }
                setAdditionalContentFontSizeIncrease={
                  setAdditionalContentFontSizeIncrease
                }
              />
            )}

            {selectedCategory === "blood_donation" && (
              <BloodDonationForm
                contactNumbers={contactNumbers}
                setContactNumbers={setContactNumbers}
                selectedBloodTypes={selectedBloodTypes}
                setSelectedBloodTypes={setSelectedBloodTypes}
                showContactHours={showContactHours}
                setShowContactHours={setShowContactHours}
                preferredGender={preferredGender}
                setPreferredGender={setPreferredGender}
                showGenderDetails={showGenderDetails}
                setShowGenderDetails={setShowGenderDetails}
                bloodTypes={bloodTypes}
                genderOptions={genderOptions}
                addContactNumber={addContactNumber}
                removeContactNumber={removeContactNumber}
                updateContactNumber={updateContactNumber}
                toggleContactHours={toggleContactHours}
                toggleBloodType={toggleBloodType}
                bloodDonationFontSizeIncrease={bloodDonationFontSizeIncrease}
                setBloodDonationFontSizeIncrease={
                  setBloodDonationFontSizeIncrease
                }
                previewRef={previewRef}
              />
            )}

            {selectedCategory === "condolence_thanks" && (
              <CondolenceThanksForm />
            )}

            {selectedCategory === "prayer_request" && (
              <PrayerRequestForm prayerOptions={prayerOptions} />
            )}

            {selectedCategory === "prayer_times" && <PrayerTimeForm />}

            {/* Preview Component - Only for death announcements */}
            {selectedCategory === "death_announcement" && (
              <div className="mb-8 flex justify-center" ref={previewRef}>
                <IslamicDeadPreview
                  formData={templateData}
                  topContentFontSizeIncrease={topContentFontSizeIncrease}
                  additionalContentFontSizeIncrease={
                    additionalContentFontSizeIncrease
                  }
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="text-center pt-6">
              {/* {["death_announcement", "blood_donation", "prayer_request", "condolence_thanks", "prayer_times"].includes(selectedCategory)
                ? (

                  // the download button
                  <button
                    type="button"
                    onClick={downloadMemorialImage}
                    disabled={loading}
                    className="bg-islamic-green text-white px-8 py-4 rounded-lg font-arabic-title text-xl hover:bg-islamic-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>جاري التحميل...</span>
                      </div>
                    ) : (
                      "تحميل الصورة"
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-islamic-green text-white px-8 py-4 rounded-lg font-arabic-title text-xl hover:bg-islamic-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>جاري الإرسال...</span>
                      </div>
                    ) : (
                      "إرسال " +
                      (categories.find((cat) => cat.id === selectedCategory)
                        ?.name || "")
                    )}
                  </button>
                )} */}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default MemorialForm;
