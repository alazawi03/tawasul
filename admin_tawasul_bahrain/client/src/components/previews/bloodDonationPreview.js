import React, { useEffect, useRef } from "react";
import "./bloodDonationPreview.css"; // Add this import for custom styles
import moment from "moment-hijri";

function BloodDonationPreview({
  name,
  personalId,
  contactNumbers,
  bloodType,
  donationLocation,
  donationDate,
  donationTimes,
  gender, // Add gender prop
  // Font size control (unified)
  bloodDonationFontSizeIncrease,
}) {
  // دالة لتحديد كلمة الأخ أو الأخت حسب الجنس
  const getGenderPrefix = (gender) => {
    if (gender === "ذكر" || gender === "male") {
      return "لأخيكم";
    } else if (gender === "أنثى" || gender === "female") {
      return "لأختكم";
    }
    return "لأخيكم"; // Default to male
  };

  // دالة لتحديد نص المتبرعين حسب الجنس
  const getDonorsText = () => {
    return "الحاجة الى 15 متبرعين (رجال فقط) بصحة جيدة"; // Default to male
  };
  // دالة لتحويل الوقت إلى تنسيق صباحًا / مساءً
  // تحويل الوقت لتنسيق صباحًا / مساءً
  const formatTimeArabic = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? "مساءً" : "صباحًا";
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  // توليد قائمة الأوقات المهيأة بصيغة "من كذا إلى كذا"
  const formattedTimeRanges =
    Array.isArray(donationTimes) && donationTimes.length > 0
      ? donationTimes
        .filter((slot) => slot.from && slot.to)
        .map((slot, index) => (
          <span key={index} className="">
            من {formatTimeArabic(slot.from)} إلى {formatTimeArabic(slot.to)}
          </span>
        ))
      : [<span key="default">من [الوقت] إلى [الوقت]</span>];

  // تنسيق فصائل الدم
  const bloodTypesDisplay =
    Array.isArray(bloodType) && bloodType.length > 0
      ? bloodType.join(" / ")
      : bloodType || "[فصيلة الدم]";

  // تنسيق أرقام التواصل
  const contactNumbersDisplay =
    Array.isArray(contactNumbers) && contactNumbers.length > 0 ? (
      contactNumbers
        .filter((contact) => contact.number && contact.description)
        .map((contact, index) => (
          <span key={index} className="contact-info">
            <span className="important">{contact.description}</span>
            <span> </span>
            <span className="important">{contact.number}</span>
          </span>
        ))
        .reduce((acc, contact, index) => {
          if (index === 0) return [contact];
          return [
            ...acc,
            <span key={`sep-${index}`} className="font-bold waw-font mb-2">
              {" "}
              و{" "}
            </span>,
            contact,
          ];
        }, [])
    ) : (
      <span className="important">[رقم التواصل]</span>
    );
  // understand

  const dayToTime = (day) => {
    if (!day) return "[اليوم]";
    const date = new Date(day);
    const arabicDays = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return arabicDays[date.getDay()];
  };

  const dayToHijri = (day) => {
    if (!day) return "[التاريخ الهجري]";
    const hijriMoment = moment(day);
    const hijriMonths = [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الآخر",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];
    const hijriDay = hijriMoment.iDate();
    const hijriMonth = hijriMonths[hijriMoment.iMonth()];
    const hijriYear = hijriMoment.iYear();
    return `${hijriDay} ${hijriMonth} ${hijriYear}هـ`;
  };
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
    bloodDonationFontSizeIncrease !== undefined
      ? bloodDonationFontSizeIncrease
      : getResponsiveDefaults();

  // Create refs for the card and heartbeat image
  const cardRef = useRef(null);
  const heartbeatImageRef = useRef(null);
  const tawasulLogoRef = useRef(null);

  // Function to update heartbeat image size based on card size
  const updateHeartbeatImageSize = () => {
    if (cardRef.current && heartbeatImageRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      const imageWidth = cardWidth * 0.5; // 50% of card width

      heartbeatImageRef.current.style.width = `${imageWidth}px`;

      console.log(
        `Card size: ${cardWidth}px × ${cardRef.current.offsetHeight}px`
      );
      console.log(`Heartbeat image width set to: ${imageWidth}px`);
    }
  };

  // Function to update tawasul logo size based on card size
  const updateTawasulLogoSize = () => {
    if (cardRef.current && tawasulLogoRef.current) {
      const cardWidth = cardRef.current.offsetWidth;
      const logoSize = cardWidth * 0.083; // 8.3% of card width

      tawasulLogoRef.current.style.width = `${logoSize}px`;
      tawasulLogoRef.current.style.height = `${logoSize}px`;

      console.log(`Tawasul logo size set to: ${logoSize}px × ${logoSize}px`);
    }
  };

  // Function to update both images
  const updateImageSizes = () => {
    updateHeartbeatImageSize();
    updateTawasulLogoSize();
  };

  // Update image size on mount and window resize
  useEffect(() => {
    updateImageSizes();

    const handleResize = () => {
      updateImageSizes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Also update when fontSizeIncrease changes
  useEffect(() => {
    updateImageSizes();
  }, [fontSizeIncrease]);

  return (
    <div
      ref={cardRef}
      dir="rtl"
      className="previ preview-card text-gray-800 font-arabic relative blood-donation-card blood-donation-bg"
      style={{
        "--blood-font-size-increase": `${fontSizeIncrease}px`,
      }}
    >
      {/* Large transparent watermark logo in background */}
      <img
        src="/islamic-memorial/tawasul.png"
        alt="تواصل أهل البحرين"
        style={{
          position: "absolute",
          top: "50%",
          right: "50%",
          transform: "translate(50%, -50%) rotate(-15deg)",
          opacity: 0.1,
          width: "75%",
          pointerEvents: "none",
        }}
      />
      <div className="preview-content-wrapper">
        {/* Top-right logo */}
        <div className="top-bar">
          <div className="tawasul-logo-blod">
            <img
              ref={tawasulLogoRef}
              src="/islamic-memorial/tawasul.png"
              alt="تواصل أهل البحرين"
            />
          </div>

          {/* Header - Heartbeat Icon */}
          <div className="heartbeat-header">
            <img
              ref={heartbeatImageRef}
              src="/islamic-memorial/heartbeat.png"
              alt="heartbeat"
            />
          </div>
        </div>

        <div className="main-font px-[30px] flex flex-col my-0 py-0 text-right">
          <p className="prevent-wrap">
            <span>ندعوكم للتبرع </span>
            <span className="important mx-1">
              {getGenderPrefix(gender)} {name || "[اسم المتبرع له]"}
            </span>
            <span> في </span>
            <span className="important mx-1">

              {/* {this (" ") is for preventing arabic letters from sticking together} */}
              {donationLocation + " " || "[مكان التبرع]"}
            </span>
            <span>يحمل البطاقة السكانية </span>
            <span className="important mx-1">

              {/* {this (" ") is for preventing arabic letters from sticking together} */}
              {" " + personalId || "[رقم البطاقة]"}
            </span>
          </p>

          <p className="">
            <span>و ذلك يوم </span>
            <span className="important mx-1"> {dayToTime(donationDate)} </span>
            <span> بتاريخ </span>
            <span className="important mx-1"> {dayToHijri(donationDate)} </span>
            <span> الموافق </span>
            <span className="important mx-1">
              {donationDate || "[التاريخ الميلادي]"}مـ
            </span>
            <span> في الفترة </span>
            <span>
              {formattedTimeRanges.map((range, index) => (
                <React.Fragment key={index}>
                  {range}
                  {index < formattedTimeRanges.length - 1 && " و "}
                </React.Fragment>
              ))}
            </span>
          </p>

          <p className="rules">
            <span className="secondary-text">شروط و متطلبات التبرع:</span>
            <ol className="donation-rules-list">
              <li>الرجاء احضار البطاقة الذكية عند الحضور</li>
              <li>أن يكون عمر المتبرع من 18-65 سنة</li>
              <li>{getDonorsText()}</li>
              <li>
                الحاجة الى فصيلة دم{" "}
                <span dir="ltr" className="important">
                  ({bloodTypesDisplay})
                </span>
              </li>
              <li>لم يخضعوا للحجامة خلال 3 شهور الماضية</li>
              <li>الابتعاد عن الماكولات المشبعة بالدهون</li>
            </ol>
          </p>
          <p className="rules">
            <span className="important">ملاحظة هامة </span>
            <span className="note-text">
              يرجى من الاخوة المتبرعين لبس الملابس الفضفاضة الواسعة في منطقة
              الكتف للإخوة العاملين لأخذ العينة الدم بسهولة.
            </span>
          </p>

          <p className="">
            <span className="secondary-text">للتواصل: </span>
            {contactNumbersDisplay}
          </p>
        </div>
      </div>
    </div>
  );
  
}

export default BloodDonationPreview;
