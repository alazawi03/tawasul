import React, { useRef } from "react";
import BloodDonationPreview from "../previews/bloodDonationPreview";
import { useFormContext } from "react-hook-form";
import DownloadButton from "../DownloadButton"; // ⬅️ shared downloader

function BloodDonationForm({
  // Font size control (unified)
  bloodDonationFontSizeIncrease,
  setBloodDonationFontSizeIncrease,
  // Optional external ref (from parent)
  previewRef,
}) {
  const { register, watch, setValue } = useFormContext();

  // local state
  const [timeSlots, setTimeSlots] = React.useState([{ from: "", to: "" }]);
  const [contactNumbers, setContactNumbers] = React.useState([
    { number: "", description: "" },
  ]);

  // capture target (use parent ref if provided, else local)
  const localPreviewRef = useRef(null);
  const cardRef = previewRef || localPreviewRef;

  // ---- handlers ----
  const handleTimeSlotChange = (idx, field, value) => {
    const updated = [...timeSlots];
    updated[idx][field] = value;
    setTimeSlots(updated);
    setValue("donationTimes", updated);
  };

  const addTimeSlot = () => setTimeSlots([...timeSlots, { from: "", to: "" }]);

  const removeTimeSlot = (idx) => {
    if (timeSlots.length > 1) {
      const updated = timeSlots.filter((_, i) => i !== idx);
      setTimeSlots(updated);
      setValue("donationTimes", updated);
    }
  };

  const handleContactNumberChange = (idx, field, value) => {
    const updated = [...contactNumbers];
    updated[idx][field] = value;
    setContactNumbers(updated);
    setValue("contactNumbers", updated);
  };

  const addContactNumber = () => {
    if (contactNumbers.length < 2) {
      setContactNumbers([...contactNumbers, { number: "", description: "" }]);
    }
  };

  const removeContactNumber = (idx) => {
    if (contactNumbers.length > 1) {
      const updated = contactNumbers.filter((_, i) => i !== idx);
      setContactNumbers(updated);
      setValue("contactNumbers", updated);
    }
  };

  React.useEffect(() => setValue("donationTimes", timeSlots), [timeSlots, setValue]);
  React.useEffect(() => setValue("contactNumbers", contactNumbers), [contactNumbers, setValue]);

  // safe filename e.g. blood-donation-2025-08-24.png
  const filename = `blood-donation-${new Date().toLocaleDateString("en-CA")}.png`;

  return (
    <div dir="rtl" className="blood-form-section">
      <form className="space-y-4">
        <label className="form-label">رقم البطاقة الشخصية للمتوفي *</label>
        <input
          type="number"
          {...register("personalId")}
          placeholder="البطاقة الشخصية"
          className="form-input"
          maxLength={9}
          minLength={9}
          required
        />

        {/* Gender selection */}
        <label className="form-label">الجنس *</label>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="ذكر"
              {...register("gender", { required: true })}
              className="form-radio"
              required
            />
            <span>ذكر</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="أنثى"
              {...register("gender", { required: true })}
              className="form-radio"
              required
            />
            <span>أنثى</span>
          </label>
        </div>

        <label className="form-label">اسم المريض *</label>
        <input
          type="text"
          {...register("name")}
          placeholder="اسم المريض"
          className="form-input"
          required
        />

        <label className="form-label">رقم التواصل *</label>
        <div className="form-group-boxed">
          <label className="form-label text-sm font-medium text-islamic-dark block mb-2">
            أرقام التواصل* (يمكن إضافة رقمين كحد أقصى)
          </label>

          {contactNumbers.map((contact, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-2">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                {/* Name */}
                <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                  <span className="text-sm text-islamic-green font-semibold">الاسم</span>
                  <input
                    type="text"
                    className="form-input text-sm w-full max-w-full min-w-0"
                    placeholder="مثال: والد المريض، أخو المريض"
                    required
                    value={contact.description}
                    onChange={(e) =>
                      handleContactNumberChange(idx, "description", e.target.value)
                    }
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                  <span className="text-sm text-islamic-green font-semibold">رقم التواصل</span>
                  <input
                    type="number"
                    className="form-input text-sm w-full max-w-full min-w-0"
                    placeholder="رقم التواصل"
                    required
                    value={contact.number}
                    onChange={(e) =>
                      handleContactNumberChange(idx, "number", e.target.value)
                    }
                  />
                </div>

                {/* Remove */}
                {contactNumbers.length > 1 && (
                  <div className="flex justify-center sm:justify-start sm:flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeContactNumber(idx)}
                      className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                      title="حذف رقم التواصل"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {contactNumbers.length < 2 && (
            <button
              type="button"
              onClick={addContactNumber}
              className="bg-islamic-green text-white px-4 py-1 rounded mb-4"
            >
              إضافة رقم آخر
            </button>
          )}
        </div>

        <label className="form-label">فصائل الدم المطلوبة *</label>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 bg-white shadow border border-gray-300 rounded px-3 py-2 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                value={type}
                {...register("bloodType")}
                className="form-checkbox ml-2"
              />
              <span className="text-sm font-semibold">{type}</span>
            </label>
          ))}
        </div>

        <label className="form-label">مكان التبرع *</label>
        <input
          type="text"
          {...register("donationLocation")}
          placeholder="مكان التبرع"
          className="form-input"
          required
        />

        <label className="form-label">تاريخ التبرع *</label>
        <input type="date" {...register("donationDate")} className="form-input" required />

        {/* Times */}
        <div className="form-group-boxed">
          <label className="form-label text-sm font-medium text-islamic-dark block mb-2">
            أوقات التبرع* (يمكن إضافة أكثر من وقت)
          </label>

          {timeSlots.map((slot, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg mb-2">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                {/* From */}
                <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                  <span className="text-sm text-islamic-green font-semibold">من</span>
                  <input
                    type="time"
                    className="form-input text-sm w-full max-w-full min-w-0"
                    required
                    value={slot.from}
                    onChange={(e) => handleTimeSlotChange(idx, "from", e.target.value)}
                  />
                </div>

                {/* To */}
                <div className="flex flex-col space-y-2 sm:flex-1 sm:min-w-0">
                  <span className="text-sm text-islamic-green font-semibold">إلى</span>
                  <input
                    type="time"
                    className="form-input text-sm w-full max-w-full min-w-0"
                    required
                    value={slot.to}
                    onChange={(e) => handleTimeSlotChange(idx, "to", e.target.value)}
                  />
                </div>

                {/* Remove */}
                {timeSlots.length > 1 && (
                  <div className="flex justify-center sm:justify-start sm:flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(idx)}
                      className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                      title="حذف وقت التبرع"
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
            onClick={addTimeSlot}
            className="bg-islamic-green text-white px-4 py-1 rounded mb-4"
          >
            إضافة وقت آخر
          </button>
        </div>

        {/* Font size control */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6 border-2 border-islamic-gold/30">
          <h3 className="text-lg font-bold text-islamic-dark mb-4 text-center">
            🎨 التحكم في حجم الخط
          </h3>

          <div className="mb-4">
            <label className="form-label text-islamic-green font-semibold">
              حجم خط إعلان التبرع بالدم
            </label>
            <input
              type="range"
              min="-30"
              max="30"
              value={bloodDonationFontSizeIncrease}
              onChange={(e) => setBloodDonationFontSizeIncrease(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>صغير جداً (-30)</span>
              <span className="font-bold text-islamic-green">
                {bloodDonationFontSizeIncrease > 0 ? "+" : ""}
                {bloodDonationFontSizeIncrease}
              </span>
              <span>كبير جداً (+30)</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              يتحكم في جميع نصوص الإعلان: اسم المريض، مكان التبرع، التاريخ، الأوقات، الشروط، أرقام التواصل
            </p>
          </div>
        </div>
      </form>

      {/* Live Preview + Download */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div ref={cardRef} className="preview-card">
          <BloodDonationPreview
            {...watch()}
            bloodDonationFontSizeIncrease={bloodDonationFontSizeIncrease}
          />
        </div>

        {/* Shared download button (same look as others) */}
        <DownloadButton
          targetRef={cardRef}
          filename={filename}
          scale={2}
          forceSize={1080}
          className="
            bg-islamic-green text-white px-8 py-4 rounded-xl
            font-cairo font-bold shadow-md
            hover:bg-islamic-green/90
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

export default BloodDonationForm;
