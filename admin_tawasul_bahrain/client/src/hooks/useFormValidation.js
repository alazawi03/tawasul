import { useCallback } from "react";
import { toast } from "react-toastify";

export const useFormValidation = () => {
  // Inline validation functions that return error messages instead of showing toasts
  const validateNameInline = useCallback((name) => {
    if (!name?.trim()) {
      return "الاسم مطلوب";
    }
    if (name.length < 2) {
      return "الاسم يجب أن يكون أكثر من حرفين";
    }
    if (name.length > 100) {
      return "الاسم طويل جداً";
    }
    // Allow Arabic, English, numbers, spaces, and safe punctuation
    if (
      !/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0041-\u005A\u0061-\u007A\u0030-\u0039\s.-_]+$/.test(
        name
      )
    ) {
      return "الاسم يحتوي على رموز غير مسموحة";
    }
    // Prevent potential security issues
    if (/<script|javascript:|data:|vbscript:|onload|onerror/i.test(name)) {
      return "الاسم يحتوي على محتوى غير مسموح";
    }
    return null;
  }, []);

  const validateCprInline = useCallback((cpr) => {
    if (!cpr?.trim()) {
      return "رقم ال CPR مطلوب";
    }
    if (!/^\d{9}$/.test(cpr)) {
      return "رقم ال CPR يجب أن يكون 9 أرقام بالضبط";
    }
    return null;
  }, []);

  const validateAgeInline = useCallback((age) => {
    if (!age) return null; // Optional field
    if (!/^\d{1,3}$/.test(age)) {
      return "العمر يجب أن يكون أرقام فقط";
    }
    const num = parseInt(age);
    if (num < 1) {
      return "العمر يجب أن يكون على الأقل سنة واحدة";
    }
    if (num > 150) {
      return "العمر يجب أن لا يتجاوز 150 سنة";
    }
    return null;
  }, []);

  const validatePhoneInline = useCallback((phone) => {
    if (!phone?.trim()) {
      return "رقم الهاتف مطلوب";
    }
    // Bahrain phone number validation (8 digits)
    if (!/^\d{8}$/.test(phone)) {
      return "رقم الهاتف يجب أن يكون 8 أرقام";
    }
    return null;
  }, []);

  const validateGenderInline = useCallback((gender) => {
    if (!gender) {
      return "الجنس مطلوب";
    }
    return null;
  }, []);

  const validateRelationshipInline = useCallback((relationship) => {
    if (!relationship?.trim()) {
      return "صلة القرابة مطلوبة";
    }
    return null;
  }, []);

  const validateContactNameInline = useCallback((name) => {
    if (!name?.trim()) {
      return "اسم جهة الاتصال مطلوب";
    }
    if (name.length < 2) {
      return "الاسم يجب أن يكون أكثر من حرفين";
    }
    if (
      !/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/.test(
        name
      )
    ) {
      return "يجب أن يحتوي الاسم على أحرف عربية فقط";
    }
    return null;
  }, []);

  const validateRelativeNameInline = useCallback((name) => {
    if (!name?.trim()) {
      return "اسم القريب مطلوب";
    }
    if (name.length < 2) {
      return "الاسم يجب أن يكون أكثر من حرفين";
    }
    if (
      !/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/.test(
        name
      )
    ) {
      return "يجب أن يحتوي الاسم على أحرف عربية فقط";
    }
    return null;
  }, []);

  const validateLocationInline = useCallback((location) => {
    if (!location) return null; // Optional field
    if (
      !/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s،.-]*$/.test(
        location
      )
    ) {
      return "يجب أن يحتوي المكان على أحرف عربية فقط";
    }
    return null;
  }, []);

  const validateBloodDonationNameInline = useCallback((name) => {
    if (!name?.trim()) {
      return "الاسم مطلوب";
    }
    if (name.length < 2) {
      return "الاسم يجب أن يكون أكثر من حرفين";
    }
    return null;
  }, []);

  const validateDonationLocationInline = useCallback((location) => {
    if (!location?.trim()) {
      return "مكان التبرع مطلوب";
    }
    return null;
  }, []);

  const validateCondolenceTimes = useCallback(
    (condolenceTimesMen, condolenceTimesWomen) => {
      const validateTimesArray = (times, genderLabel) => {
        for (let i = 0; i < times.length; i++) {
          const time = times[i];

          // Check if day is selected
          if (!time.day) {
            toast.error(
              "يجب اختيار يوم لأوقات التعزية " + genderLabel + " رقم " + (i + 1)
            );
            return false;
          }

          // Check if all time ranges are filled
          for (let j = 0; j < time.timeRanges.length; j++) {
            const range = time.timeRanges[j];
            if (!range.from.trim() || !range.to.trim()) {
              toast.error(
                "يجب ملء جميع أوقات التعزية " + genderLabel + " رقم " + (i + 1)
              );
              return false;
            }
          }
        }
        return true;
      };

      return (
        validateTimesArray(condolenceTimesMen, "للرجال") &&
        validateTimesArray(condolenceTimesWomen, "للنساء")
      );
    },
    []
  );

  const validateDeathAnnouncement = useCallback(
    (data, relatives, contactNumbers) => {
      // Validate required fields
      if (!data.name?.trim()) {
        toast.error("الاسم مطلوب");
        return false;
      }
      if (!data.gender) {
        toast.error("الجنس مطلوب");
        return false;
      }
      if (!data.cprNumber?.trim()) {
        toast.error("الرقم الشخصي مطلوب");
        return false;
      }
      // Validate CPR number format (9 digits)
      if (!/^[\d]{9}$/.test(data.cprNumber)) {
        toast.error("الرقم الشخصي يجب أن يكون 9 أرقام");
        return false;
      }
      if (!data.reporterMobile?.trim()) {
        toast.error("رقم جوال المبلغ مطلوب");
        return false;
      }

      // Validate relatives: each must have at least one non-empty name
      for (let i = 0; i < relatives.length; i++) {
        const rel = relatives[i];
        if (
          !rel.names ||
          rel.names.length === 0 ||
          !rel.names.some((n) => n.name && n.name.trim())
        ) {
          toast.error(
            `يجب إدخال اسم واحد على الأقل لكل علاقة (مجموعة رقم ${i + 1})`
          );
          return false;
        }
      }

      // Validate contact numbers (1-4 required)
      if (contactNumbers.length === 0) {
        toast.error("يجب إضافة رقم تواصل واحد على الأقل");
        return false;
      }
      if (contactNumbers.length > 4) {
        toast.error("لا يمكن إضافة أكثر من 4 أرقام تواصل");
        return false;
      }

      // Validate that all contact numbers have required fields
      for (let i = 0; i < contactNumbers.length; i++) {
        const contact = contactNumbers[i];
        if (!contact.phone?.trim()) {
          toast.error(`رقم الهاتف مطلوب لجهة الاتصال رقم ${i + 1}`);
          return false;
        }
        if (!contact.name?.trim()) {
          toast.error(`اسم جهة الاتصال مطلوب لرقم ${i + 1}`);
          return false;
        }
      }

      // Conditional validation: if burial date is provided, then burial location and time become mandatory
      if (data.deathDateGregorian) {
        if (!data.burialLocation) {
          toast.error("مكان الدفان مطلوب عند إدخال تاريخ الدفان");
          return false;
        }
        // Validate custom burial location if "خارج البحرين" is selected
        if (
          data.burialLocation === "خارج البحرين" &&
          !data.customBurialLocation?.trim()
        ) {
          toast.error("يجب تحديد مكان الدفان خارج البحرين");
          return false;
        }
        if (!data.burialTimeType || !data.burialTimeValue) {
          toast.error("وقت الدفان مطلوب عند إدخال تاريخ الدفان");
          return false;
        }
      }

      if (!data.cprPhoto || data.cprPhoto.length === 0) {
        toast.error("صورة البطاقة الشخصية مطلوبة");
        return false;
      }

      return true;
    },
    []
  );

  const validateBloodDonation = useCallback(
    (data, selectedBloodTypes, contactNumbers, preferredGender) => {
      // Validate required fields
      if (!data.name?.trim()) {
        toast.error("الاسم مطلوب");
        return false;
      }
      if (!data.reporterNumber?.trim()) {
        toast.error("رقم المبلغ مطلوب");
        return false;
      }
      if (selectedBloodTypes.length === 0) {
        toast.error("يجب اختيار فصيلة دم واحدة على الأقل");
        return false;
      }
      if (!data.donationLocation?.trim()) {
        toast.error("مكان التبرع مطلوب");
        return false;
      }
      if (contactNumbers.length === 0) {
        toast.error("يجب إضافة رقم تواصل واحد على الأقل");
        return false;
      }

      // Validate that contact numbers have phone numbers
      const invalidContact = contactNumbers.find(
        (contact) => !contact.phone?.trim()
      );
      if (invalidContact) {
        toast.error("يجب إدخال رقم هاتف صحيح لجميع أرقام التواصل");
        return false;
      }

      // Validate mixed gender preference counts
      if (preferredGender === "mixed" && data.donorsNeeded) {
        const maleCount = parseInt(data.maleDonatorsCount || 0);
        const femaleCount = parseInt(data.femaleDonatorsCount || 0);
        const totalCount = parseInt(data.donorsNeeded);

        if (maleCount + femaleCount !== totalCount) {
          toast.error(
            "مجموع عدد الذكور والإناث (" +
              (maleCount + femaleCount) +
              ") يجب أن يساوي العدد الكلي للمتبرعين المطلوب (" +
              totalCount +
              ")"
          );
          return false;
        }
      }

      return true;
    },
    []
  );

  return {
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
    validateBloodDonationNameInline,
    validateDonationLocationInline,

    // Form submission validation functions
    validateCondolenceTimes,
    validateDeathAnnouncement,
    validateBloodDonation,
  };
};
