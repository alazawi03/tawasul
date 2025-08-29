import React from "react";
import { useFormContext } from "react-hook-form";
import moment from "moment-hijri";
import { useFormValidation } from "../../hooks/useFormValidation";

const DeathAnnouncementForm = ({
  contactNumbers = [],
  setContactNumbers,
  relatives = [],
  setRelatives,
  condolenceTimesMen = [],
  setCondolenceTimesMen,
  condolenceTimesWomen = [],
  setCondolenceTimesWomen,
  skipBurialDetails,
  setSkipBurialDetails,
  burialCompleted,
  setBurialCompleted,
  relationshipOptions = [],
  burialLocations = [],
  genderOptions = [],
  prayerOptions = [],
  addContactNumber,
  removeContactNumber,
  updateContactNumber,
  addRelative,
  removeRelative,
  updateRelative,
  addNameToRelative,
  removeNameFromRelative,
  updateRelativeName,
  addCondolenceTime,
  removeCondolenceTime,
  updateCondolenceTime,
  addTimeRange,
  removeTimeRange,
  updateTimeRange,
  // Inline validation functions
  validateNameInline: validateNameInlineProp,
  validateCprInline: validateCprInlineProp,
  validateAgeInline: validateAgeInlineProp,
  validatePhoneInline: validatePhoneInlineProp,
  validateGenderInline: validateGenderInlineProp,
  validateRelationshipInline: validateRelationshipInlineProp,
  validateContactNameInline: validateContactNameInlineProp,
  validateRelativeNameInline: validateRelativeNameInlineProp,
  validateLocationInline: validateLocationInlineProp,
  topContentFontSizeIncrease,
  setTopContentFontSizeIncrease,
  additionalContentFontSizeIncrease,
  setAdditionalContentFontSizeIncrease,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Use props if provided, otherwise use hook
  const {
    validateNameInline,
    validateCprInline,
    validateAgeInline,
    validatePhoneInline,
    validateGenderInline,
    validateRelationshipInline,
    validateContactNameInline,
    validateRelativeNameInline,
    validateLocationInline,
  } = useFormValidation();

  // Use prop functions if provided, otherwise use hook functions
  const validateName = validateNameInlineProp || validateNameInline;
  const validateCpr = validateCprInlineProp || validateCprInline;
  const validateAge = validateAgeInlineProp || validateAgeInline;
  const validatePhone = validatePhoneInlineProp || validatePhoneInline;
  const validateGender = validateGenderInlineProp || validateGenderInline;
  const validateRelationship =
    validateRelationshipInlineProp || validateRelationshipInline;
  const validateContactName =
    validateContactNameInlineProp || validateContactNameInline;
  const validateRelativeName =
    validateRelativeNameInlineProp || validateRelativeNameInline;
  const validateLocation = validateLocationInlineProp || validateLocationInline;

  const gender = watch("gender");

  React.useEffect(() => {
    if (gender === "انثى") {
      // For each "الزوج" group, keep only the first name
      const newRelatives = relatives.map((r) => {
        if (r.relationship === "الزوج" && r.names && r.names.length > 1) {
          return { ...r, names: [r.names[0]] };
        }
        return r;
      });
      setRelatives(newRelatives);
    }
  }, [gender, relatives, setRelatives]);

  // Clear burial fields when skipBurialDetails is checked
  React.useEffect(() => {
    if (skipBurialDetails) {
      setValue("deathDateGregorian", "");
      setValue("burialLocation", "");
      setValue("customBurialLocation", "");
      setValue("burialTimeType", "");
      setValue("burialTimeValue", "");
      setValue("graveNumber", "");
      setValue("graveSection", "");
    }
  }, [skipBurialDetails, setValue]);

  // Clear burial fields when burialCompleted is checked
  React.useEffect(() => {
    if (burialCompleted) {
      setValue("deathDateGregorian", "");
      setValue("burialLocation", "");
      setValue("customBurialLocation", "");
      setValue("burialTimeType", "");
      setValue("burialTimeValue", "");
      setValue("graveNumber", "");
      setValue("graveSection", "");
    }
  }, [burialCompleted, setValue]);

  const watchCondolenceLocationMen = watch("condolenceLocationMen");
  const watchCondolenceLocationWomen = watch("condolenceLocationWomen");
  const watchBurialLocation = watch("burialLocation");
  const watchBurialDate = watch("deathDateGregorian");

  const dayOptions = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const prayerTimeOptions = [
    "صلاة الفجر",
    "صلاة الظهر",
    "صلاة العصر",
    "صلاة المغرب",
    "صلاة العشاء",
  ];

  // Function to get filtered prayer options based on burial date
  const getFilteredPrayerOptions = React.useCallback(() => {
    if (!watchBurialDate) {
      return prayerOptions;
    }

    const burialDate = new Date(watchBurialDate);
    const isFriday = burialDate.getDay() === 5; // Friday is day 5 (0=Sunday, 1=Monday, ..., 5=Friday, 6=Saturday)

    if (isFriday) {
      // On Friday: show صلاة الجمعة, hide صلاة الظهر
      return prayerOptions.filter((prayer) => prayer !== "بعد صلاة الظهر");
    } else {
      // Not Friday: show صلاة الظهر, hide صلاة الجمعة
      return prayerOptions.filter((prayer) => prayer !== "بعد صلاة الجمعة");
    }
  }, [watchBurialDate, prayerOptions]);

  // Clear burial time value if selected prayer is no longer available due to date change
  React.useEffect(() => {
    const currentBurialTimeValue = watch("burialTimeValue");
    if (currentBurialTimeValue && watchBurialDate) {
      const availablePrayers = getFilteredPrayerOptions();
      if (!availablePrayers.includes(currentBurialTimeValue)) {
        setValue("burialTimeValue", "");
      }
    }
  }, [watchBurialDate, setValue, watch, getFilteredPrayerOptions]);

  // Helper function to get available day options for men's condolence times
  const getAvailableDayOptionsMen = (currentTimeSlotId) => {
    const selectedDays = condolenceTimesMen
      .filter((timeSlot) => timeSlot.id !== currentTimeSlotId && timeSlot.day)
      .map((timeSlot) => timeSlot.day);
    return dayOptions.filter((day) => !selectedDays.includes(day));
  };

  // Helper function to get available day options for women's condolence times
  const getAvailableDayOptionsWomen = (currentTimeSlotId) => {
    const selectedDays = condolenceTimesWomen
      .filter((timeSlot) => timeSlot.id !== currentTimeSlotId && timeSlot.day)
      .map((timeSlot) => timeSlot.day);
    return dayOptions.filter((day) => !selectedDays.includes(day));
  };

  // Custom handler for photo file input
  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setValue("photo", file || "");
  };

  return (
    <>
      {/* CPR Number */}
      <div>
        <label className="form-label">رقم البطاقة الشخصية للمتوفي *</label>
        <input
          type="text"
          maxLength={9}
          className="form-input"
          placeholder="رقم البطاقة الشخصية للمتوفي (9 أرقام)"
          {...register("cprNumber", {
            validate: validateCpr,
          })}
          onInput={(e) => {
            // Only allow digits
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        {errors.cprNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.cprNumber.message}
          </p>
        )}
      </div>
      {/* 1. Name */}
      <div>
        <label className="form-label">الاسم الثلاثي للمتوفى *</label>
        <input
          type="text"
          className="form-input"
          placeholder="الاسم الكامل للمتوفى"
          {...register("name", {
            validate: validateName,
          })}
          onInput={(e) => {
            // Allow Arabic, English, numbers, spaces, and common punctuation
            e.target.value = e.target.value.replace(
              /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0041-\u005A\u0061-\u007A\u0030-\u0039\s._-]/g,
              ""
            );
          }}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* 2. Gender */}
      <div>
        <label className="form-label">الجنس *</label>
        <select
          className="form-input"
          {...register("gender", {
            validate: validateGender,
          })}
        >
          <option value="" disabled hidden>
            اختر الجنس
          </option>
          {genderOptions.map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* 3. Age */}
      <div>
        <label className="form-label">العمر (اختياري)</label>
        <input
          type="text"
          className="form-input"
          placeholder="العمر بالسنوات"
          maxLength="3"
          {...register("age", {
            validate: validateAge,
          })}
          onInput={(e) => {
            // Only allow digits and limit to 3 characters
            e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 3);
          }}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
        )}
      </div>

      {/* 4. Status/Profession */}
      <div>
        <label className="form-label">المهنة السابقة للمتوفى (اختياري)</label>
        <input
          type="text"
          className="form-input"
          placeholder="مثال: استاذ، طبيب، مهندس، متقاعد, رضيع..."
          {...register("status")}
        />
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Burial Options Section */}
      <div className="burial-options-section">
        <label className="form-label">تفاصيل الدفن *</label>
        <div className="space-y-3">
          {/* Option 1: Skip burial details */}
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <input
              type="radio"
              name="burialOption"
              id="skipBurialDetails"
              value="skip"
              checked={skipBurialDetails}
              onChange={(e) => {
                if (e.target.value === "skip") {
                  setSkipBurialDetails(true);
                  setBurialCompleted(false);
                }
              }}
              className="w-5 h-5 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-2"
            />
            <label
              htmlFor="skipBurialDetails"
              className="cursor-pointer text-lg font-medium text-yellow-700"
            >
              تحديد تفاصيل الدفن لاحقًا
            </label>
          </div>

          {/* Option 2: Burial completed */}
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <input
              type="radio"
              name="burialOption"
              id="burialCompleted"
              value="completed"
              checked={burialCompleted}
              onChange={(e) => {
                if (e.target.value === "completed") {
                  setBurialCompleted(true);
                  setSkipBurialDetails(false);
                }
              }}
              className="w-5 h-5 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-2"
            />
            <label
              htmlFor="burialCompleted"
              className="cursor-pointer text-lg font-medium text-yellow-700"
            >
              تم الدفن
            </label>
          </div>

          {/* Option 3: Specify burial details */}
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
            <input
              type="radio"
              name="burialOption"
              id="specifyBurialDetails"
              value="specify"
              checked={!skipBurialDetails && !burialCompleted}
              onChange={(e) => {
                if (e.target.value === "specify") {
                  setSkipBurialDetails(false);
                  setBurialCompleted(false);
                }
              }}
              className="w-5 h-5 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-2"
            />
            <label
              htmlFor="specifyBurialDetails"
              className="cursor-pointer text-lg font-medium text-yellow-700"
            >
              تحديد تفاصيل الدفن
            </label>
          </div>
        </div>
      </div>

      {/* 5. Burial Date, Location, Time */}
      {!skipBurialDetails && !burialCompleted && (
        <>
          <div>
            <label className="form-label">تاريخ الدفن (ميلادي) *</label>
            <input
              type="date"
              className="form-input"
              {...register("deathDateGregorian", {
                required: "تاريخ الدفن مطلوب",
              })}
            />
            {errors.deathDateGregorian && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deathDateGregorian.message}
              </p>
            )}
            <p className="text-xs text-islamic-gold mt-1">
              مطلوب - يجب تحديد تاريخ الدفن مع مكان ووقت الدفن
            </p>
            {/* Auto-calculated Hijri Date Display */}
            {watch("deathDateGregorian") && (
              <div className="mt-2 p-3 bg-islamic-beige rounded-lg border border-islamic-gold/20">
                <p className="text-sm text-islamic-green font-medium">
                  التاريخ الهجري:{" "}
                  {moment(watch("deathDateGregorian")).format("iD/iM/iYYYY")} هـ
                </p>
              </div>
            )}
          </div>
          {/* Burial Location - Only show when burial date is entered */}
          {watch("deathDateGregorian") && (
            <div>
              <label className="form-label">مكان الدفن *</label>
              <select
                className="form-input"
                {...register("burialLocation", {
                  required: "مكان الدفن مطلوب عند إدخال تاريخ الدفن",
                })}
              >
                <option value="" disabled hidden>
                  اختر مكان الدفن *
                </option>
                {burialLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              {errors.burialLocation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.burialLocation.message}
                </p>
              )}
              {/* Custom Burial Location for Outside Bahrain */}
              {watchBurialLocation === "خارج البحرين" && (
                <div className="mt-4">
                  <label className="form-label">حدد مكان الدفن *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="اكتب مكان الدفن خارج البحرين..."
                    {...register("customBurialLocation", {
                      required:
                        watchBurialLocation === "خارج البحرين"
                          ? "يجب تحديد مكان الدفن"
                          : false,
                    })}
                  />
                  {errors.customBurialLocation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.customBurialLocation.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Burial Time - Only show when burial date is entered */}
          {watch("deathDateGregorian") && (
            <div>
              <label className="form-label">وقت الدفن *</label>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="manual"
                      {...register("burialTimeType", {
                        required: "نوع وقت الدفن مطلوب عند إدخال تاريخ الدفن",
                      })}
                      className="w-4 h-4 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-2"
                    />
                    <span className="text-islamic-green">وقت محدد</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="after_prayer"
                      {...register("burialTimeType", {
                        required: "نوع وقت الدفن مطلوب عند إدخال تاريخ الدفن",
                      })}
                      className="w-4 h-4 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-2"
                    />
                    <span className="text-islamic-green">بعد الصلاة</span>
                  </label>
                </div>
                {watch("burialTimeType") === "manual" && (
                  <input
                    type="time"
                    className="form-input"
                    {...register("burialTimeValue", {
                      required: "وقت الدفن مطلوب",
                    })}
                  />
                )}
                {watch("burialTimeType") === "after_prayer" && (
                  <select
                    className="form-input"
                    {...register("burialTimeValue", {
                      required: "اختيار الصلاة مطلوب",
                    })}
                  >
                    <option value="" disabled hidden>
                      اختر الصلاة *
                    </option>
                    {getFilteredPrayerOptions().map((prayer, index) => (
                      <option key={index} value={prayer}>
                        {prayer}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {errors.burialTimeType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.burialTimeType.message}
                </p>
              )}
              {errors.burialTimeValue && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.burialTimeValue.message}
                </p>
              )}
            </div>
          )}

          {/* Grave Details - Only show when burial location is selected */}
          {watch("deathDateGregorian") &&
            watchBurialLocation &&
            watchBurialLocation !== "خارج البحرين" && (
              <div>
                <label className="form-label">تفاصيل القبر (اختياري)</label>
                <p className="text-sm text-gray-600 mb-2">
                  يجب ملء كلا الحقلين أو تركهما فارغين
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="رقم القبر"
                      {...register("graveNumber", {
                        validate: (value) => {
                          const graveSection = watch("graveSection");
                          if (value && !graveSection) {
                            return "يجب إدخال رقم القطعة أيضاً";
                          }
                          if (!value && graveSection) {
                            return "يجب إدخال رقم القبر أيضاً";
                          }
                          return true;
                        },
                      })}
                    />
                    {errors.graveNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.graveNumber.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="رقم القطعة"
                      {...register("graveSection", {
                        validate: (value) => {
                          const graveNumber = watch("graveNumber");
                          if (value && !graveNumber) {
                            return "يجب إدخال رقم القبر أيضاً";
                          }
                          if (!value && graveNumber) {
                            return "يجب إدخال رقم القطعة أيضاً";
                          }
                          return true;
                        },
                      })}
                    />
                    {errors.graveSection && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.graveSection.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
        </>
      )}

      {/* 6. Condolence Locations (Men/Women) */}
      <div className="space-y-4">
        <div>
          <label className="form-label">مكان التعزية للرجال (اختياري)</label>
          <input
            type="text"
            className="form-input"
            placeholder="مكان استقبال التعازي للرجال"
            maxLength="500"
            {...register("condolenceLocationMen", {
              maxLength: {
                value: 500,
                message: "مكان التعزية يجب أن لا يتجاوز 500 حرف",
              },
            })}
          />
          <div className="flex justify-between items-center mt-1">
            <div></div>
            <p className="text-sm text-gray-500">
              {(watchCondolenceLocationMen || "").length}/500 حرف
            </p>
          </div>
          {errors.condolenceLocationMen && (
            <p className="text-red-500 text-sm mt-1">
              {errors.condolenceLocationMen.message}
            </p>
          )}
        </div>
        {/* Men's Condolence Reception Times */}
        {watchCondolenceLocationMen && (
          <div className="bg-islamic-beige p-4 rounded-lg border border-islamic-gold/20">
            <label className="form-label text-islamic-green">
              وقت استقبال التعازي للرجال (اختياري)
            </label>
            <p className="text-sm text-islamic-brown mb-2">
              اختياري - يمكنك تحديد أوقات التعزية أو تركها فارغة
            </p>

            {condolenceTimesMen.map((timeSlot, timeIndex) => (
              <div
                key={timeSlot.id}
                className="mb-6 p-4 bg-white rounded-lg border border-islamic-gold/10"
              >
                {/* Day Selection */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-islamic-dark mb-2 block">
                    اختر اليوم (اختياري)
                  </label>
                  <select
                    className="form-input w-full"
                    value={timeSlot.day}
                    onChange={(e) =>
                      updateCondolenceTime(
                        "men",
                        timeSlot.id,
                        "day",
                        e.target.value
                      )
                    }
                  >
                    <option value="">اختر اليوم</option>
                    {/* Show current selected day if it exists */}
                    {timeSlot.day &&
                      !getAvailableDayOptionsMen(timeSlot.id).includes(
                        timeSlot.day
                      ) && (
                        <option key={timeSlot.day} value={timeSlot.day}>
                          {timeSlot.day}
                        </option>
                      )}
                    {/* Show available day options */}
                    {getAvailableDayOptionsMen(timeSlot.id).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Ranges - FIXED RESPONSIVE LAYOUT */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-islamic-dark block">
                    أوقات الاستقبال (اختياري)
                  </label>
                  {timeSlot.timeRanges.map((range, rangeIndex) => (
                    <div key={rangeIndex} className="bg-gray-50 p-3 rounded-lg">
                      {/* MOBILE-FIRST RESPONSIVE CONTAINER */}
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                        {/* FROM TIME SECTION */}
                        <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                          <span className="text-sm text-islamic-green font-medium">
                            من
                          </span>

                          {/* Radio buttons for time type */}
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`men_fromTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="manual"
                                checked={range.fromType === "manual"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "men",
                                    timeSlot.id,
                                    rangeIndex,
                                    "fromType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                وقت
                              </span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`men_fromTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="prayer"
                                checked={range.fromType === "prayer"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "men",
                                    timeSlot.id,
                                    rangeIndex,
                                    "fromType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                صلاة
                              </span>
                            </label>
                          </div>

                          {/* Time input/select with proper constraints */}
                          {range.fromType === "manual" ? (
                            <input
                              type="time"
                              className="form-input text-sm w-full max-w-full min-w-0"
                              value={range.from}
                              onChange={(e) =>
                                updateTimeRange(
                                  "men",
                                  timeSlot.id,
                                  rangeIndex,
                                  "from",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <select
                              className="form-input text-sm w-full max-w-full min-w-0 truncate"
                              value={range.from}
                              onChange={(e) =>
                                updateTimeRange(
                                  "men",
                                  timeSlot.id,
                                  rangeIndex,
                                  "from",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">اختر وقت الصلاة</option>
                              {prayerTimeOptions.map((prayer) => (
                                <option key={prayer} value={prayer}>
                                  {prayer}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* TO TIME SECTION */}
                        <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                          <span className="text-sm text-islamic-green font-medium">
                            إلى
                          </span>

                          {/* Radio buttons for time type */}
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`men_toTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="manual"
                                checked={range.toType === "manual"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "men",
                                    timeSlot.id,
                                    rangeIndex,
                                    "toType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                وقت
                              </span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`men_toTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="prayer"
                                checked={range.toType === "prayer"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "men",
                                    timeSlot.id,
                                    rangeIndex,
                                    "toType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                صلاة
                              </span>
                            </label>
                          </div>

                          {/* Time input/select with proper constraints */}
                          {range.toType === "manual" ? (
                            <input
                              type="time"
                              className="form-input text-sm w-full max-w-full min-w-0"
                              value={range.to}
                              onChange={(e) =>
                                updateTimeRange(
                                  "men",
                                  timeSlot.id,
                                  rangeIndex,
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <select
                              className="form-input text-sm w-full max-w-full min-w-0 truncate"
                              value={range.to}
                              onChange={(e) =>
                                updateTimeRange(
                                  "men",
                                  timeSlot.id,
                                  rangeIndex,
                                  "to",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">اختر وقت الصلاة</option>
                              {prayerTimeOptions.map((prayer) => (
                                <option key={prayer} value={prayer}>
                                  {prayer}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* REMOVE BUTTON - PROPERLY POSITIONED */}
                        {timeSlot.timeRanges.length > 1 && (
                          <div className="flex justify-center sm:justify-start sm:flex-shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                removeTimeRange("men", timeSlot.id, rangeIndex)
                              }
                              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                              title="حذف هذا الوقت"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addTimeRange("men", timeSlot.id)}
                    className="bg-islamic-green text-white px-3 py-2 rounded text-sm hover:bg-islamic-green-dark"
                  >
                    + إضافة وقت آخر
                  </button>
                </div>

                {/* Remove Time Slot Button */}
                <button
                  type="button"
                  onClick={() => removeCondolenceTime("men", timeSlot.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                >
                  حذف هذا اليوم
                </button>
              </div>
            ))}

            {/* Add New Day Button */}
            <button
              type="button"
              onClick={() => addCondolenceTime("men")}
              className="bg-islamic-green text-white px-4 py-2 rounded hover:bg-islamic-green-dark"
            >
              + إضافة يوم جديد
            </button>
          </div>
        )}

        <div>
          <label className="form-label">مكان التعزية للنساء (اختياري)</label>
          <input
            type="text"
            className="form-input"
            placeholder="مكان استقبال التعازي للنساء"
            maxLength="500"
            {...register("condolenceLocationWomen", {
              maxLength: {
                value: 500,
                message: "مكان التعزية يجب أن لا يتجاوز 500 حرف",
              },
            })}
          />
          <div className="flex justify-between items-center mt-1">
            <div></div>
            <p className="text-sm text-gray-500">
              {(watchCondolenceLocationWomen || "").length}/500 حرف
            </p>
          </div>
          {errors.condolenceLocationWomen && (
            <p className="text-red-500 text-sm mt-1">
              {errors.condolenceLocationWomen.message}
            </p>
          )}
        </div>
        {/* Women's Condolence Reception Times */}
        {watchCondolenceLocationWomen && (
          <div className="bg-islamic-beige p-4 rounded-lg border border-islamic-gold/20">
            <label className="form-label text-islamic-green">
              وقت استقبال التعازي للنساء (اختياري)
            </label>
            <p className="text-sm text-islamic-brown mb-2">
              اختياري - يمكنك تحديد أوقات التعزية أو تركها فارغة
            </p>

            {condolenceTimesWomen.map((timeSlot, timeIndex) => (
              <div
                key={timeSlot.id}
                className="mb-6 p-4 bg-white rounded-lg border border-islamic-gold/10"
              >
                {/* Day Selection */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-islamic-dark mb-2 block">
                    اختر اليوم (اختياري)
                  </label>
                  <select
                    className="form-input w-full"
                    value={timeSlot.day}
                    onChange={(e) =>
                      updateCondolenceTime(
                        "women",
                        timeSlot.id,
                        "day",
                        e.target.value
                      )
                    }
                  >
                    <option value="">اختر اليوم</option>
                    {/* Show current selected day if it exists */}
                    {timeSlot.day &&
                      !getAvailableDayOptionsWomen(timeSlot.id).includes(
                        timeSlot.day
                      ) && (
                        <option key={timeSlot.day} value={timeSlot.day}>
                          {timeSlot.day}
                        </option>
                      )}
                    {/* Show available day options */}
                    {getAvailableDayOptionsWomen(timeSlot.id).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Ranges - FIXED RESPONSIVE LAYOUT */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-islamic-dark block">
                    أوقات الاستقبال (اختياري)
                  </label>
                  {timeSlot.timeRanges.map((range, rangeIndex) => (
                    <div key={rangeIndex} className="bg-gray-50 p-3 rounded-lg">
                      {/* MOBILE-FIRST RESPONSIVE CONTAINER */}
                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                        {/* FROM TIME SECTION */}
                        <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                          <span className="text-sm text-islamic-green font-medium">
                            من
                          </span>

                          {/* Radio buttons for time type */}
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`women_fromTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="manual"
                                checked={range.fromType === "manual"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "women",
                                    timeSlot.id,
                                    rangeIndex,
                                    "fromType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                وقت
                              </span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`women_fromTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="prayer"
                                checked={range.fromType === "prayer"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "women",
                                    timeSlot.id,
                                    rangeIndex,
                                    "fromType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                صلاة
                              </span>
                            </label>
                          </div>

                          {/* Time input/select with proper constraints */}
                          {range.fromType === "manual" ? (
                            <input
                              type="time"
                              className="form-input text-sm w-full max-w-full min-w-0"
                              value={range.from}
                              onChange={(e) =>
                                updateTimeRange(
                                  "women",
                                  timeSlot.id,
                                  rangeIndex,
                                  "from",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <select
                              className="form-input text-sm w-full max-w-full min-w-0 truncate"
                              value={range.from}
                              onChange={(e) =>
                                updateTimeRange(
                                  "women",
                                  timeSlot.id,
                                  rangeIndex,
                                  "from",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">اختر وقت الصلاة</option>
                              {prayerTimeOptions.map((prayer) => (
                                <option key={prayer} value={prayer}>
                                  {prayer}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* TO TIME SECTION */}
                        <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                          <span className="text-sm text-islamic-green font-medium">
                            إلى
                          </span>

                          {/* Radio buttons for time type */}
                          <div className="flex gap-3">
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`women_toTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="manual"
                                checked={range.toType === "manual"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "women",
                                    timeSlot.id,
                                    rangeIndex,
                                    "toType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                وقت
                              </span>
                            </label>
                            <label className="flex items-center gap-1">
                              <input
                                type="radio"
                                name={`women_toTimeType_${timeSlot.id}_${rangeIndex}`}
                                value="prayer"
                                checked={range.toType === "prayer"}
                                onChange={(e) =>
                                  updateTimeRange(
                                    "women",
                                    timeSlot.id,
                                    rangeIndex,
                                    "toType",
                                    e.target.value
                                  )
                                }
                                className="w-3 h-3 text-islamic-gold bg-gray-100 border-gray-300 focus:ring-islamic-gold focus:ring-1"
                              />
                              <span className="text-xs text-islamic-green">
                                صلاة
                              </span>
                            </label>
                          </div>

                          {/* Time input/select with proper constraints */}
                          {range.toType === "manual" ? (
                            <input
                              type="time"
                              className="form-input text-sm w-full max-w-full min-w-0"
                              value={range.to}
                              onChange={(e) =>
                                updateTimeRange(
                                  "women",
                                  timeSlot.id,
                                  rangeIndex,
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <select
                              className="form-input text-sm w-full max-w-full min-w-0 truncate"
                              value={range.to}
                              onChange={(e) =>
                                updateTimeRange(
                                  "women",
                                  timeSlot.id,
                                  rangeIndex,
                                  "to",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">اختر وقت الصلاة</option>
                              {prayerTimeOptions.map((prayer) => (
                                <option key={prayer} value={prayer}>
                                  {prayer}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* REMOVE BUTTON - PROPERLY POSITIONED */}
                        {timeSlot.timeRanges.length > 1 && (
                          <div className="flex justify-center sm:justify-start sm:flex-shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                removeTimeRange(
                                  "women",
                                  timeSlot.id,
                                  rangeIndex
                                )
                              }
                              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                              title="حذف هذا الوقت"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addTimeRange("women", timeSlot.id)}
                    className="bg-islamic-green text-white px-3 py-2 rounded text-sm hover:bg-islamic-green-dark"
                  >
                    + إضافة وقت آخر
                  </button>
                </div>

                {/* Remove Time Slot Button */}
                <button
                  type="button"
                  onClick={() => removeCondolenceTime("women", timeSlot.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                >
                  حذف هذا اليوم
                </button>
              </div>
            ))}

            {/* Add New Day Button */}
            <button
              type="button"
              onClick={() => addCondolenceTime("women")}
              className="bg-islamic-green text-white px-4 py-2 rounded hover:bg-islamic-green-dark"
            >
              + إضافة يوم جديد
            </button>
          </div>
        )}
      </div>

      {/* 7. Contact Numbers */}
      <div>
        <label className="form-label">أرقام التواصل *</label>
        <p className="text-lg text-islamic-dark mb-2 font-medium">
          أضف أرقام التواصل لأهل المتوفى (مطلوب رقم واحد على الأقل، بحد أقصى 4
          أرقام)
        </p>
        <div className="p-3 bg-islamic-beige/30 rounded-lg border border-islamic-gold/20">
          <p className="text-[#333] text-700">
            💡 إذا لم يكن الرقم بحريني، الرجاء البدء بـ00 ثم مفتاح الدولة
          </p>
        </div>

        {contactNumbers.length === 0 && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm">
              يجب إضافة رقم تواصل واحد على الأقل
            </p>
          </div>
        )}

        {contactNumbers.length >= 4 && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-600 text-sm">
              تم الوصول للحد الأقصى (4 أرقام تواصل)
            </p>
          </div>
        )}

        {contactNumbers.map((contact, index) => (
          <div
            key={index}
            className="mb-4 p-4 bg-white rounded-lg border border-islamic-gold/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-islamic-dark mb-2 block">
                  الاسم *
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="اسم الشخص"
                  value={contact.name || ""}
                  onChange={(e) =>
                    updateContactNumber(index, "name", e.target.value)
                  }
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-sm font-medium text-islamic-dark mb-2 block">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  className="form-input w-full"
                  placeholder="أدخل رقم الهاتف"
                  value={contact.phone || ""}
                  pattern="[0-9]*"
                  onChange={(e) =>
                    updateContactNumber(
                      index,
                      "phone",
                      e.target.value.replace(/[^0-9]/g, "")
                    )
                  }
                />
              </div>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeContactNumber(index)}
              className="mt-3 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
            >
              حذف الرقم
            </button>
          </div>
        ))}

        {/* Add Contact Button */}
        {/* Add Contact Button - disabled if at maximum limit */}
        <button
          type="button"
          onClick={addContactNumber}
          disabled={contactNumbers.length >= 4}
          className={`px-4 py-2 rounded text-white ${
            contactNumbers.length >= 4
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-islamic-green hover:bg-islamic-green-dark"
          }`}
        >
          + إضافة رقم تواصل{" "}
          {contactNumbers.length < 4
            ? `(${contactNumbers.length}/4)`
            : "(مكتمل)"}
        </button>
      </div>

      {/* 8. Relatives Section */}
      <div>
        <label className="form-label">أقارب المتوفى (اختياري)</label>
        <p className="text-islamic-brown mb-4 text-lg">
          أضف أسماء الأقارب والأهل للمتوفى إن أردت ذكرهم في البيان
        </p>

        {relatives &&
          relatives.map((relative, relativeIndex) => (
            <div
              key={relativeIndex}
              className="mb-6 p-4 bg-islamic-beige/30 rounded-lg border border-islamic-gold/20"
            >
              {/* Relationship Selection */}
              <div className="mb-4">
                <label className="text-lg font-medium text-islamic-dark mb-2 block">
                  نوع العلاقة *
                </label>
                <select
                  className="form-input w-full"
                  value={relative.relationship}
                  onChange={(e) =>
                    updateRelative(
                      relativeIndex,
                      "relationship",
                      e.target.value
                    )
                  }
                >
                  <option value="" disabled hidden>
                    اختر العلاقة
                  </option>
                  {/* Existing options, but skip الأخ and الأخت here */}
                  {relationshipOptions(relativeIndex).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Relationship */}
              {relative.relationship === "أخرى" && (
                <div className="mb-4">
                  <label className="text-lg font-medium text-islamic-dark mb-2 block">
                    حدد العلاقة *
                  </label>
                  <input
                    type="text"
                    className="form-input w-full"
                    value={relative.customRelationship || ""}
                    onChange={(e) =>
                      updateRelative(
                        relativeIndex,
                        "customRelationship",
                        e.target.value
                      )
                    }
                    placeholder="اكتب العلاقة..."
                  />
                </div>
              )}

              {/* Show spouse note only if "الزوج" is selected */}
              {relative.relationship === "الزوج" && (
                <div className="text-red-600 pb-10 text-xl font-bold">
                  {watch("gender") === "انثى"
                    ? "يمكنك إضافة زوج واحد فقط للمرأة."
                    : ""}
                </div>
              )}

              {/* Names List */}
              <div className="mb-4">
                <label className="text-lg font-medium text-islamic-dark mb-2 block">
                  الأسماء
                </label>

                {relative.names &&
                  relative.names.map((nameObj, nameIndex) => (
                    <div
                      key={nameIndex}
                      className="mb-3 p-3 bg-white rounded-lg border border-islamic-gold/10"
                    >
                      <div className="flex items-start gap-3">
                        {/* Name Input */}
                        <div className="flex-1">
                          <input
                            type="text"
                            className="form-input w-full"
                            value={nameObj.name}
                            onChange={(e) =>
                              updateRelativeName(
                                relativeIndex,
                                nameIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="اسم النسيب..."
                          />
                        </div>

                        {/* Remove Name Button */}
                        {relative.names.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeNameFromRelative(relativeIndex, nameIndex)
                            }
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                          >
                            حذف
                          </button>
                        )}
                      </div>

                      {/* Deceased Status Checkbox */}
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id={`deceased-${relativeIndex}-${nameIndex}`}
                          checked={nameObj.isDeceased || false}
                          onChange={(e) =>
                            updateRelativeName(
                              relativeIndex,
                              nameIndex,
                              "isDeceased",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-islamic-green bg-gray-100 border-gray-300 rounded focus:ring-islamic-green focus:ring-2"
                        />
                        <label
                          htmlFor={`deceased-${relativeIndex}-${nameIndex}`}
                          className="text-lg text-islamic-dark cursor-pointer"
                        >
                          متوفى/متوفاة (سيتم إضافة "رحمه الله" بجانب الاسم)
                        </label>
                      </div>
                    </div>
                  ))}

                {/* Add Name Button */}
                {relative.relationship && relative.relationship !== "الزوج" && (
                  <button
                    type="button"
                    onClick={() => {
                      console.log(`Button clicked at ${Date.now()}`);
                      addNameToRelative(relativeIndex);
                    }}
                    className="bg-islamic-green text-white px-3 py-2 rounded hover:bg-islamic-green-dark mt-2 ml-2"
                  >
                    أضف اسم آخر لنفس العلاقة
                  </button>
                )}

                {/* Remove Relative Group Button */}
                <button
                  type="button"
                  onClick={() => removeRelative(relativeIndex)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
                >
                  حذف مجموعة العلاقة
                </button>
              </div>
            </div>
          ))}

        {/* Add Relative Button */}
        <button
          type="button"
          onClick={addRelative}
          className="bg-islamic-gold text-white px-4 py-2 rounded hover:bg-islamic-gold-dark mb-4"
        >
          إضافة علاقة
        </button>
      </div>

      {/* 9. Photo Upload */}
      <div>
        <label className="form-label">صورة المتوفى (اختياري)</label>
        <input
          type="file"
          accept="image/*"
          className="form-input"
          onChange={handlePhotoChange}
        />
        <p className="text-xs text-gray-500 mt-1">
          اختياري - سيتم عرض الصورة في البيان
        </p>
      </div>

      {/* 10. CPR Photo Upload */}
      <div>
        <label className="form-label">صورة البطاقة الشخصية *</label>
        <input
          type="file"
          accept="image/*"
          className="form-input"
          {...register("cprPhoto", { required: "صورة البطاقة الشخصية مطلوبة" })}
        />
        {errors.cprPhoto && (
          <p className="text-red-500 text-sm mt-1">{errors.cprPhoto.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          مطلوب - يرجى تحميل صورة واضحة للبطاقة الشخصية
        </p>
      </div>

      {/* 11. Reporter Mobile Number */}
      <div>
        <label className="form-label">رقم هاتف المبلغ *</label>
        <input
          type="tel"
          className="form-input"
          placeholder="أدخل رقم هاتف المبلغ"
          {...register("reporterMobile", {
            required: "رقم هاتف المبلغ مطلوب",
            pattern: {
              value: /^[+]?[0-9\s\-()]+$/,
              message: "رقم هاتف غير صحيح",
            },
            minLength: { value: 8, message: "رقم الهاتف قصير جداً" },
          })}
        />
        {errors.reporterMobile && (
          <p className="text-red-500 text-sm mt-1">
            {errors.reporterMobile.message}
          </p>
        )}
        <p className="text-xs text-islamic-gold mt-1">
          مطلوب - رقم هاتف الشخص الذي يقوم بنشر البيان
        </p>
      </div>

      {/* Font Size Control Dashboard */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6 border-2 border-islamic-gold/30">
        <h3 className="text-lg font-bold text-islamic-dark mb-4 text-center">
          🎨 التحكم في أحجام الخطوط
        </h3>

        {/* Main Content Font Size Control */}
        <div className="mb-4">
          <label className="form-label text-islamic-green font-semibold">
            حجم خط المحتوى الرئيسي
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={topContentFontSizeIncrease}
            onChange={(e) =>
              setTopContentFontSizeIncrease(Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>صغير جداً (-30)</span>
            <span className="font-bold text-islamic-green">
              {topContentFontSizeIncrease > 0 ? "+" : ""}
              {topContentFontSizeIncrease}
            </span>
            <span>كبير جداً (+30)</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            يتحكم في: اسم المتوفى، العمر، الانتقال النص، المهنة، التواريخ
          </p>
        </div>

        {/* Additional Content Font Size Control */}
        <div className="mb-4">
          <label className="form-label text-islamic-green font-semibold">
            حجم خط المحتوى الإضافي
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={additionalContentFontSizeIncrease}
            onChange={(e) =>
              setAdditionalContentFontSizeIncrease(Number(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>صغير جداً (-30)</span>
            <span className="font-bold text-islamic-green">
              {additionalContentFontSizeIncrease > 0 ? "+" : ""}
              {additionalContentFontSizeIncrease}
            </span>
            <span>كبير جداً (+30)</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            يتحكم في: تفاصيل الدفن، معلومات العزاء، أرقام التواصل، الأقارب
          </p>
        </div>
      </div>
    </>
  );
};

export default DeathAnnouncementForm;
