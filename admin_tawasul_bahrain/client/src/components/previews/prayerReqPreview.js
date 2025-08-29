import React from "react";
import "./prayerReqPreview.css";

const PrayerRequestPreview = ({ patientName }) => {
  return (
    <div className="prayer-request-preview">
      {/* ✅ Background watermark logo - handled by CSS ::after pseudo-element */}

      {/* Top-right Logo */}
      <div className="tawasul-logo-prayer">
        <img src="/islamic-memorial/tawasul.png" alt="تواصل" />
      </div>

      {/* Ayah Calligraphy Image */}
      <img
        src="/islamic-memorial/prayer-header.png"
        alt="وإذا مرضت فهو يشفين"
        className="prayer-request-header-image"
      />

      {/* دعاء Tag */}
      <div className="duaa-container">
        <img src="/islamic-memorial/ask_duaa.png" alt="دعاء" />
      </div>

      {/* Du'aa Lines */}
      <p className="prayer-request-duaa-text">
        اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ البَأْسَ ، اشْفِ عبدك
      </p>

      {/* Patient Name */}
      <p className="prayer-request-patient-name">
        {patientName || "[أسم المريض]"}
      </p>

      {/* Closing Line */}
      <p className="prayer-request-closing-text">
        وَأَنتَ الشَّافِي، لاَ شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لاَ يُغَادِرُ
        سَقَمًا
      </p>

      {/* Mountains Image at Bottom */}
      <img
        src="/islamic-memorial/prayer-mounts.png"
        alt="mountains"
        className="prayer-request-mountains"
      />
    </div>
  );
};

export default PrayerRequestPreview;
