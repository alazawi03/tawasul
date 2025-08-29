import React from "react";
import "./condelenceThanksPreview.css";

function CondelenceThanksPreview({ data, condolenceFontSizeIncrease }) {
  // Calculate responsive font size increases
  const getResponsiveDefaults = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 480) return -18; // Extra small mobile
    if (screenWidth <= 768) return -12; // Small tablets
    if (screenWidth <= 1024) return -5; // Medium screens
    return 10; // Large screens
  };

  // Use provided font size or fall back to responsive defaults
  const fontSizeIncrease =
    condolenceFontSizeIncrease !== undefined
      ? condolenceFontSizeIncrease
      : getResponsiveDefaults();

  return (
    <div
      className="condelence-thanks-preview"
      style={{
        "--condolence-font-size-increase": `${fontSizeIncrease}px`,
      }}
    >
      <img
        src="/islamic-memorial/tawasul.png"
        alt="تواصل أهل البحرين"
        className="watermark-background"
      />

      <div className="tawasul-logo-thanks">
        <img src="/islamic-memorial/tawasul.png" alt="تواصل أهل البحرين" />
      </div>

      <div className="header-section">
        <h2 className="header-title">
          <i className="fa-solid fa-hand-holding-heart hand-icon"></i> شكر على
          التعزية
        </h2>
      </div>

      <div className="main-content">
        <div className="family-text">
          <h1>تتقدم عائلة</h1>
          <h2 className="family-name">{data?.familyName || "[اسم العائلة]"}</h2>
        </div>
        <p className="condolence-text">
          بجزيل الشكر والامتنان والتقدير والعرفان إلى كل من حضر الصلاة والدفن{" "}
          {data?.gender === "female" ? "لفقيدتنا المرحومة" : "لفقيدنا المرحوم"}{" "}
          بإذن الله
        </p>
        <p className="deceased-name-c">
          {data?.deceasedName || "[اسم المتوفى]"}
        </p>
      </div>

      <div className="gratitude-section">
        <p className="gratitude-text">
          سيكون تقديم واجب العزاء بالحضور أو الإتصال أو عبر قنوات التواصل
          الاجتماعي من مملكة البحرين وخارجها ، ونلتمس العذر لمن حالت دونه
          الظروف. سائلين المولى عز وجل أن يتغمد فقيدنا بواسع رحمته ورضوانه، وأن
          يسكنه فسيح جناته، وأن يكتب للجميع الأجر والثواب، وأن لا يريهم مكروها
          في عزيز لديهم. وجزاكم الله خيرا
        </p>
      </div>
    </div>
  );
}

export default CondelenceThanksPreview;
