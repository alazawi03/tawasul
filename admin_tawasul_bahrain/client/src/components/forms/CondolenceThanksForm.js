import React from "react";
import { useFormContext } from "react-hook-form";
import CondelenceThanksPreview from "../previews/condelenceThanksPreview";
import DownloadButton from "../DownloadButton"; // ✅ shared downloader

const CondolenceThanksForm = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const [condolenceFontSizeIncrease, setCondolenceFontSizeIncrease] =
    React.useState(() => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) return -18;
      if (screenWidth <= 768) return -12;
      if (screenWidth <= 1024) return -5;
      return 10;
    });

  const previewRef = React.useRef(null);

  // CPR validation
  const validateCpr = (value) => {
    if (!value) return "رقم البطاقة الشخصية مطلوب";
    if (value.length !== 9) return "رقم البطاقة الشخصية يجب أن يكون 9 أرقام";
    if (!/^\d{9}$/.test(value))
      return "رقم البطاقة الشخصية يجب أن يحتوي على أرقام فقط";
    return true;
  };

  // filename like condolence_thanks-2025-08-24.png
  const filename = `condolence_thanks-${new Date().toLocaleDateString("en-CA")}.png`;

  return (
    <>
      {/* CPR */}
      <div>
        <label className="form-label">رقم البطاقة الشخصية للمتوفي *</label>
        <input
          type="text"
          maxLength={9}
          className="form-input"
          placeholder="رقم البطاقة الشخصية للمتوفي (9 أرقام)"
          {...register("cprNumber", { validate: validateCpr })}
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        {errors.cprNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cprNumber.message}</p>
        )}
      </div>

      {/* Family Name */}
      <div>
        <label className="form-label">اسم العائلة *</label>
        <input
          type="text"
          className="form-input"
          placeholder="اسم العائلة"
          {...register("familyName", {
            required: "اسم العائلة مطلوب",
            minLength: { value: 2, message: "اسم العائلة يجب أن يكون أكثر من حرفين" },
          })}
        />
        {errors.familyName && (
          <p className="text-red-500 text-sm mt-1">{errors.familyName.message}</p>
        )}
      </div>

      {/* Deceased Name */}
      <div>
        <label className="form-label">اسم المتوفى *</label>
        <input
          type="text"
          className="form-input"
          placeholder="اسم المتوفى"
          {...register("deceasedName", {
            required: "اسم المتوفى مطلوب",
            minLength: { value: 2, message: "اسم المتوفى يجب أن يكون أكثر من حرفين" },
          })}
        />
        {errors.deceasedName && (
          <p className="text-red-500 text-sm mt-1">{errors.deceasedName.message}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="form-label">جنس المتوفى *</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="male"
              className="ml-2"
              {...register("gender", { required: "يرجى تحديد جنس المتوفى" })}
            />
            <span className="text-gray-700">ذكر</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="female"
              className="ml-2"
              {...register("gender", { required: "يرجى تحديد جنس المتوفى" })}
            />
            <span className="text-gray-700">أنثى</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>

      {/* Font Size Control */}
      <div className="bg-gray-50 p-4 rounded-lg mt-6 border-2 border-islamic-gold/30">
        <h3 className="text-lg font-bold text-islamic-dark mb-4 text-center">
          🎨 التحكم في حجم الخط
        </h3>
        <div className="mb-4">
          <label className="form-label text-islamic-green font-semibold">
            حجم خط بطاقة شكر التعزية
          </label>
          <input
            type="range"
            min="-30"
            max="30"
            value={condolenceFontSizeIncrease}
            onChange={(e) => setCondolenceFontSizeIncrease(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>صغير جداً (-30)</span>
            <span className="font-bold text-islamic-green">
              {condolenceFontSizeIncrease > 0 ? "+" : ""}
              {condolenceFontSizeIncrease}
            </span>
            <span>كبير جداً (+30)</span>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="flex mt-8 text-center justify-center preview-card" ref={previewRef}>
        <CondelenceThanksPreview
          data={watch()}
          condolenceFontSizeIncrease={condolenceFontSizeIncrease}
        />
      </div>

      {/* Shared Download Button (same styling as your old one) */}
      <div className="text-center mt-6">
        <DownloadButton
          targetRef={previewRef}
          filename={filename}
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
    </>
  );
};

export default CondolenceThanksForm;
