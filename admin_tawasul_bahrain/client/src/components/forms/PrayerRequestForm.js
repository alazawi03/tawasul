import React from "react";
import { useFormContext } from "react-hook-form";
import PrayerRequestPreview from "../previews/prayerReqPreview";
import DownloadButton from "../DownloadButton"; // ✅ shared downloader

function PrayerRequestForm() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  // CPR validation function
  const validateCpr = (value) => {
    if (!value) return "رقم البطاقة الشخصية مطلوب";
    if (value.length !== 9) return "رقم البطاقة الشخصية يجب أن يكون 9 أرقام";
    if (!/^\d{9}$/.test(value))
      return "رقم البطاقة الشخصية يجب أن يحتوي على أرقام فقط";
    return true;
  };

  const previewRef = React.useRef(null);
  const dlName = `prayer_request-${new Date().toLocaleDateString("en-CA")}.png`;

  return (
    <div dir="rtl" className="space-y-6">
      {/* CPR */}
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
      <form className="space-y-4">
        <div>
          <label className="form-label">اسم المريض *</label>
          <input
            type="text"
            className="form-input"
            placeholder="اسم المريض المطلوب الدعاء له"
            {...register("patientName", {
              required: "اسم المريض مطلوب",
              minLength: {
                value: 2,
                message: "الاسم يجب أن يكون أكثر من حرفين",
              },
            })}
          />
          {errors.patientName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.patientName.message}
            </p>
          )}
          <p className="text-xs text-islamic-gold mt-1">
            🤲 اللهم اشف مرضانا ومرضى المسلمين
          </p>
        </div>
      </form>

      {/* Live Preview */}
      <div className="mt-10 flex flex-col items-center gap-20">
        <div ref={previewRef} className="prayer-request-container">
          <PrayerRequestPreview {...watch()} />
        </div>
        <DownloadButton
          targetRef={previewRef}
          scale={2}
          forceSize={1080}
          className="
                    bg-islamic-green text-white px-8 py-4 rounded-lg
                    font-arabic-title text-xl
                    hover:bg-islamic-green-dark transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    min-w-[200px]
                  "
        >
          تحميل الصورة
        </DownloadButton>
      </div>
    </div>
  );
}

export default PrayerRequestForm;
