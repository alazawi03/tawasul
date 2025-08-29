import React, { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment-hijri";
import "./islamicPrev_v2.css";

const IslamicdeadPreview_v2 = ({
  formData,
  topContentFontSizeIncrease,
  additionalContentFontSizeIncrease,
}) => {
  // Get responsive default value based on screen size if not provided
  const getResponsiveDefault = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 500) return -20; // Extra small (xs)
    if (screenWidth <= 768) return -15; // Small (sm)
    if (screenWidth <= 1024) return 0; // Medium (md)
    return 20; // Large (lg)
  };

  // Get responsive default value for additional content
  const getResponsiveAdditionalDefault = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 500) return -18; // Extra small (xs)
    if (screenWidth <= 768) return -12; // Small (sm)
    if (screenWidth <= 1024) return -5; // Medium (md)
    return 10; // Large (lg)
  };

  const fontSizeIncrease =
    topContentFontSizeIncrease !== undefined
      ? topContentFontSizeIncrease
      : getResponsiveDefault();

  const additionalFontSizeIncrease =
    additionalContentFontSizeIncrease !== undefined
      ? additionalContentFontSizeIncrease
      : getResponsiveAdditionalDefault();
  const [contentDistribution, setContentDistribution] = useState({
    topElements: [],
    bottomElements: [],
  });
  const topContentRef = useRef(null);
  const extraContentRef = useRef(null);

  // Helper function to get grammatically correct Arabic age form
  const getArabicAgeForm = (age) => {
    const ageNum = parseInt(age);

    if (ageNum === 1) {
      return `عام`;
    } else if (ageNum === 2) {
      return `عامين`;
    } else if (ageNum > 2 && ageNum <= 10) {
      return `${ageNum} أعوام`;
    } else if (ageNum === 11) {
      return `${ageNum} عامًا`;
    }

    return `${ageNum} عامًا`; // fallback
  };

  const displayAge = () => {
    if (!formData.age) return "";
    const ageForm = getArabicAgeForm(formData.age);
    return (
      <>
        عن عمر يناهز <span style={{ fontWeight: "700" }}>{ageForm}</span>
      </>
    );
  };

  // Display gender-based transition text
  const displayTransitionText = () => {
    return formData.gender === "انثى"
      ? "انتقلت إلى رحمة الله تعالى"
      : "انتقل إلى رحمة الله تعالى";
  };

  // Handle photo display - convert File objects to URLs
  const getPhotoUrl = () => {
    if (!formData.photo) {
      return null;
    }

    // If it's already a URL string, return it
    if (typeof formData.photo === "string") {
      return formData.photo;
    }

    // If it's a File object, create a blob URL
    if (formData.photo instanceof File) {
      const url = URL.createObjectURL(formData.photo);
      return url;
    }

    return null;
  };

  const hasPhoto = () => {
    return getPhotoUrl() !== null;
  };

  // Helper: Format children for memorial preview (males first, then females, deceased grouped)
  function formatChildren(relatives, deceasedGender) {
    // Separate sons and daughters
    const sons = relatives.find((r) => r.relationship === "الابن")?.names || [];
    const daughters =
      relatives.find((r) => r.relationship === "البنت")?.names || [];

    // Filter out empty names and validate
    const validSons = sons.filter(
      (child) => child.name && child.name.trim().length > 0
    );
    const validDaughters = daughters.filter(
      (child) => child.name && child.name.trim().length > 0
    );

    // If no valid children, return empty string
    if (validSons.length === 0 && validDaughters.length === 0) {
      return "";
    }

    // Separate living and deceased for each gender
    const livingMales = validSons.filter((child) => !child.isDeceased);
    const deceasedMales = validSons.filter((child) => child.isDeceased);
    const livingFemales = validDaughters.filter((child) => !child.isDeceased);
    const deceasedFemales = validDaughters.filter((child) => child.isDeceased);

    // Format living names
    const livingNames = [
      ...livingMales.map(
        (child) => `<span class="">${child.name.trim()}</span>`
      ),
      ...livingFemales.map(
        (child) => `<span class="">${child.name.trim()}</span>`
      ),
    ];

    // Format deceased names (grouped in parentheses, males first)
    let deceasedNames = "";
    const deceasedGroup = [...deceasedMales, ...deceasedFemales];
    if (deceasedGroup.length === 1) {
      deceasedNames = `<span class="">(${deceasedGroup[0].name.trim()})</span>`;
    } else if (deceasedGroup.length > 1) {
      const names = deceasedGroup
        .map((child) => child.name.trim())
        .join('<span class=""> و </span>');
      deceasedNames = `<span class="">(${names})</span>`;
    }

    // Combine all names: living first, then deceased group
    const childrenAllNames = [];
    if (livingNames.length && deceasedNames) {
      childrenAllNames.push(...livingNames, deceasedNames);
    } else if (livingNames.length) {
      childrenAllNames.push(...livingNames);
    } else if (deceasedNames) {
      childrenAllNames.push(deceasedNames);
    }

    // Join names with italic و
    const namesStr = childrenAllNames.join('<span class=""> و </span>');

    // Parent phrase
    const children = [...validSons, ...validDaughters];
    let phrase = "";
    if (children.length === 1) {
      phrase =
        deceasedGender === "ذكر"
          ? '<span class="memorial-relationship-title">والد</span>'
          : '<span class="memorial-relationship-title">والدة</span>';
    } else {
      phrase =
        deceasedGender === "ذكر"
          ? '<span class="memorial-relationship-title">والد كل من</span>'
          : '<span class="memorial-relationship-title">والدة كل من</span>';
    }

    // Rahma phrase
    const deceasedCount = deceasedGroup.length;
    let rahma = "";
    if (deceasedCount === 1) {
      // Use gender of the only deceased
      rahma = deceasedMales.length === 1 ? " رحمه الله" : " رحمها الله";
    } else if (deceasedCount > 1) {
      rahma = " رحمهم الله";
    }

    // Final output
    return `${phrase} ${namesStr}${rahma}`;
  }

  // Helper: Format siblings (شقيق/شقيق كل من) for memorial preview
  function formatSiblings(relatives, deceasedGender) {
    // Gather all full brothers and sisters (both old and new relationship names)
    const brothersOld =
      relatives.find((r) => r.relationship === "الشقيق الأخ")?.names || [];
    const sistersOld =
      relatives.find((r) => r.relationship === "الشقيق الأخت")?.names || [];
    const brothersNew =
      relatives.find((r) => r.relationship === "الأخ الشقيق")?.names || [];
    const sistersNew =
      relatives.find((r) => r.relationship === "الأخت الشقيقة")?.names || [];

    // Combine old and new relationship names and filter out empty names
    const allBrothers = [...brothersOld, ...brothersNew];
    const allSisters = [...sistersOld, ...sistersNew];

    const validBrothers = allBrothers.filter(
      (sib) => sib.name && sib.name.trim().length > 0
    );
    const validSisters = allSisters.filter(
      (sib) => sib.name && sib.name.trim().length > 0
    );

    // If no valid siblings, return empty string
    if (validBrothers.length === 0 && validSisters.length === 0) {
      return "";
    }

    // Separate living and deceased for each gender
    const livingMales = validBrothers.filter((sib) => !sib.isDeceased);
    const deceasedMales = validBrothers.filter((sib) => sib.isDeceased);
    const livingFemales = validSisters.filter((sib) => !sib.isDeceased);
    const deceasedFemales = validSisters.filter((sib) => sib.isDeceased);

    // Format living names
    const livingNames = [
      ...livingMales.map((sib) => `<span class="">${sib.name.trim()}</span>`),
      ...livingFemales.map((sib) => `<span class="">${sib.name.trim()}</span>`),
    ];

    // Format deceased names (grouped in parentheses, males first)
    let deceasedNames = "";
    const deceasedGroup = [...deceasedMales, ...deceasedFemales];
    if (deceasedGroup.length === 1) {
      deceasedNames = `<span class="">(${deceasedGroup[0].name.trim()})</span>`;
    } else if (deceasedGroup.length > 1) {
      const names = deceasedGroup
        .map((sib) => sib.name.trim())
        .join('<span class=""> و </span>');
      deceasedNames = `<span class="">(${names})</span>`;
    }

    // Combine all names: living first, then deceased group
    const siblingsAllNames = [];
    if (livingNames.length && deceasedNames) {
      siblingsAllNames.push(...livingNames, deceasedNames);
    } else if (livingNames.length) {
      siblingsAllNames.push(...livingNames);
    } else if (deceasedNames) {
      siblingsAllNames.push(deceasedNames);
    }
    const namesStr = siblingsAllNames.join('<span class=""> و </span>');

    // Title logic - gender-specific based on deceased person
    const total = validBrothers.length + validSisters.length;
    let title = "";
    if (deceasedGender === "انثى") {
      // Female deceased - use شقيقة
      title =
        total === 1
          ? '<span class="memorial-relationship-title">شقيقة</span>'
          : '<span class="memorial-relationship-title">شقيقة كل من</span>';
    } else {
      // Male deceased - use شقيق
      title =
        total === 1
          ? '<span class="memorial-relationship-title">شقيق</span>'
          : '<span class="memorial-relationship-title">شقيق كل من</span>';
    }

    // Rahma phrase (for deceased only, after last deceased)
    let rahma = "";
    if (deceasedMales.length + deceasedFemales.length === 1) {
      rahma = deceasedFemales.length === 1 ? " رحمها الله" : " رحمه الله";
    } else if (deceasedMales.length + deceasedFemales.length > 1) {
      rahma = " رحمهم الله";
    }

    // Final output
    return `${title} ${namesStr}${rahma}`;
  }

  // Helper: Format brothers/sisters (أخ/أخت based on deceased gender) for memorial preview
  function formatBrothersSisters(relatives, deceasedGender) {
    // Get brothers and sisters
    const brothers =
      relatives.find((r) => r.relationship === "الأخ")?.names || [];
    const sisters =
      relatives.find((r) => r.relationship === "الأخت")?.names || [];

    // Filter out empty names and validate
    const validBrothers = brothers.filter(
      (bro) => bro.name && bro.name.trim().length > 0
    );
    const validSisters = sisters.filter(
      (sis) => sis.name && sis.name.trim().length > 0
    );

    // If no valid brothers/sisters, return empty string
    if (validBrothers.length === 0 && validSisters.length === 0) {
      return "";
    }

    // Separate living and deceased for each gender
    const livingMales = validBrothers.filter((bro) => !bro.isDeceased);
    const deceasedMales = validBrothers.filter((bro) => bro.isDeceased);
    const livingFemales = validSisters.filter((sis) => !sis.isDeceased);
    const deceasedFemales = validSisters.filter((sis) => sis.isDeceased);

    // Format living names
    const livingNames = [
      ...livingMales.map((bro) => `<span class="">${bro.name.trim()}</span>`),
      ...livingFemales.map((sis) => `<span class="">${sis.name.trim()}</span>`),
    ];

    // Format deceased names (grouped in parentheses, males first)
    let deceasedNames = "";
    const deceasedGroup = [...deceasedMales, ...deceasedFemales];
    if (deceasedGroup.length === 1) {
      deceasedNames = `<span class="">(${deceasedGroup[0].name.trim()})</span>`;
    } else if (deceasedGroup.length > 1) {
      const names = deceasedGroup
        .map((person) => person.name.trim())
        .join('<span class=""> و </span>');
      deceasedNames = `<span class="">(${names})</span>`;
    }

    // Combine all names: living first, then deceased group
    const brothersSistersAllNames = [];
    if (livingNames.length && deceasedNames) {
      brothersSistersAllNames.push(...livingNames, deceasedNames);
    } else if (livingNames.length) {
      brothersSistersAllNames.push(...livingNames);
    } else if (deceasedNames) {
      brothersSistersAllNames.push(deceasedNames);
    }
    const namesStr = brothersSistersAllNames.join('<span class=""> و </span>');

    // Title logic - gender-specific based on deceased person
    const total = validBrothers.length + validSisters.length;
    let title = "";
    if (deceasedGender === "انثى") {
      // Female deceased - use أخت
      title =
        total === 1
          ? '<span class="memorial-relationship-title">أخت</span>'
          : '<span class="memorial-relationship-title">أخت كل من</span>';
    } else {
      // Male deceased - use أخ
      title =
        total === 1
          ? '<span class="memorial-relationship-title">أخ</span>'
          : '<span class="memorial-relationship-title">أخ كل من</span>';
    }

    // Rahma phrase (for deceased only, after last deceased)
    let rahma = "";
    if (deceasedMales.length + deceasedFemales.length === 1) {
      rahma = deceasedMales.length === 1 ? " رحمه الله" : " رحمها الله";
    } else if (deceasedMales.length + deceasedFemales.length > 1) {
      rahma = " رحمهم الله";
    }

    // Final output
    return `${title} ${namesStr}${rahma}`;
  }

  // Helper: Format spouse for female (حرم) for memorial preview
  function formatSpouse(relatives, deceasedGender) {
    // Only format spouse for females
    if (deceasedGender !== "انثى") return "";

    const spouses =
      relatives.find((r) => r.relationship === "الزوج")?.names || [];
    const validSpouses = spouses.filter(
      (spouse) => spouse.name && spouse.name.trim().length > 0
    );

    if (validSpouses.length === 0) return "";

    // Check if any spouse is deceased to determine title
    const hasDeceasedSpouse = validSpouses.some((spouse) => spouse.isDeceased);

    // Format spouse names
    const spouseNames = validSpouses.map((spouse) => {
      const name = spouse.name.trim();
      if (spouse.isDeceased) {
        return `<span class="">(${name})</span> رحمه الله`;
      }
      return `<span class="">${name}</span>`;
    });

    const namesStr = spouseNames.join('<span class=""> و </span>');

    // Use أرملة if spouse is deceased, otherwise حرم
    const title = hasDeceasedSpouse ? "أرملة" : "حرم";

    // Return formatted spouse text
    return `<span class="memorial-relationship-title">${title}</span> ${namesStr}`;
  }

  // Helper: Format in-laws (النسيب) for male for memorial preview
  function formatInLaws(relatives, deceasedGender) {
    // Only format in-laws for males
    if (deceasedGender !== "ذكر") return "";

    const inLaws =
      relatives.find((r) => r.relationship === "النسيب")?.names || [];
    const validInLaws = inLaws.filter(
      (inLaw) => inLaw.name && inLaw.name.trim().length > 0
    );

    if (validInLaws.length === 0) return "";

    // Separate living and deceased
    const livingInLaws = validInLaws.filter((inLaw) => !inLaw.isDeceased);
    const deceasedInLaws = validInLaws.filter((inLaw) => inLaw.isDeceased);

    // Format living names
    const livingNames = livingInLaws.map(
      (inLaw) => `<span class="">${inLaw.name.trim()}</span>`
    );

    // Format deceased names (grouped in parentheses)
    let deceasedNames = "";
    if (deceasedInLaws.length === 1) {
      deceasedNames = `<span class="">(${deceasedInLaws[0].name.trim()})</span>`;
    } else if (deceasedInLaws.length > 1) {
      const names = deceasedInLaws
        .map((inLaw) => inLaw.name.trim())
        .join('<span class=""> و </span>');
      deceasedNames = `<span class="">(${names})</span>`;
    }

    // Combine all names: living first, then deceased group
    const allNames = [];
    if (livingNames.length && deceasedNames) {
      allNames.push(...livingNames, deceasedNames);
    } else if (livingNames.length) {
      allNames.push(...livingNames);
    } else if (deceasedNames) {
      allNames.push(deceasedNames);
    }

    // Join names with italic و
    const namesStr = allNames.join('<span class=""> و </span>');

    // Title logic - نسيب or نسيب كل من
    const total = validInLaws.length;
    const title =
      total === 1
        ? '<span class="memorial-relationship-title">نسيب</span>'
        : '<span class="memorial-relationship-title">نسيب كل من</span>';

    // Rahma phrase (for deceased only)
    let rahma = "";
    if (deceasedInLaws.length === 1) {
      rahma = " رحمه الله";
    } else if (deceasedInLaws.length > 1) {
      rahma = " رحمهم الله";
    }

    // Final output
    return `${title} ${namesStr}${rahma}`;
  }

  // Helper: Format custom relationships (الأخرى) for memorial preview
  function formatCustomRelationships(relatives) {
    const customRelatives = relatives.filter(
      (r) =>
        r.relationship === "أخرى" &&
        r.customRelationship &&
        r.names &&
        r.names.length > 0
    );

    if (customRelatives.length === 0) return [];

    const formattedCustom = [];

    customRelatives.forEach((relative) => {
      const customTitle = relative.customRelationship;
      const validNames = relative.names.filter(
        (nameObj) => nameObj.name && nameObj.name.trim().length > 0
      );

      if (validNames.length === 0) return;

      // Separate living and deceased
      const livingNames = validNames.filter((nameObj) => !nameObj.isDeceased);
      const deceasedNames = validNames.filter((nameObj) => nameObj.isDeceased);

      // Format living names
      const livingFormatted = livingNames.map(
        (nameObj) => `<span class="">${nameObj.name.trim()}</span>`
      );

      // Format deceased names (grouped in parentheses)
      let deceasedFormatted = "";
      if (deceasedNames.length === 1) {
        deceasedFormatted = `<span class="">(${deceasedNames[0].name.trim()})</span>`;
      } else if (deceasedNames.length > 1) {
        const names = deceasedNames
          .map((nameObj) => nameObj.name.trim())
          .join('<span class=""> و </span>');
        deceasedFormatted = `<span class="">(${names})</span>`;
      }

      // Combine all names: living first, then deceased group
      const allNames = [];
      if (livingFormatted.length && deceasedFormatted) {
        allNames.push(...livingFormatted, deceasedFormatted);
      } else if (livingFormatted.length) {
        allNames.push(...livingFormatted);
      } else if (deceasedFormatted) {
        allNames.push(deceasedFormatted);
      }

      // Join names with italic و
      const namesStr = allNames.join('<span class=""> و </span>');

      // Title logic - custom title or custom title كل من
      const total = validNames.length;
      const title =
        total === 1
          ? `<span class="memorial-relationship-title">${customTitle}</span>`
          : `<span class="memorial-relationship-title">${customTitle} كل من</span>`;

      // Rahma phrase (for deceased only)
      let rahma = "";
      if (deceasedNames.length === 1) {
        rahma = " رحمه الله";
      } else if (deceasedNames.length > 1) {
        rahma = " رحمهم الله";
      }

      // Final output
      formattedCustom.push(`${title} ${namesStr}${rahma}`);
    });

    return formattedCustom;
  }

  // In displayRelatives, render children and siblings phrases as HTML
  const displayRelatives = useCallback(() => {
    if (!formData.relatives || formData.relatives.length === 0) return "";

    // Use new spouse formatting for females (should be first)
    const spouseText = formatSpouse(formData.relatives, formData.gender);
    // Use new children formatting for sons/daughters
    const childrenText = formatChildren(formData.relatives, formData.gender);
    // Use new siblings formatting
    const siblingsText = formatSiblings(formData.relatives, formData.gender);
    // Use new brothers/sisters formatting
    const brothersSistersText = formatBrothersSisters(
      formData.relatives,
      formData.gender
    );
    // Use new in-laws formatting for males (should be last before other relatives)
    const inLawsText = formatInLaws(formData.relatives, formData.gender);
    // Use new custom relationships formatting
    const customRelationshipsTexts = formatCustomRelationships(
      formData.relatives
    );

    // Collect formatted relationship texts (in-laws last before custom relationships)
    let relationshipTexts = [];
    if (spouseText) relationshipTexts.push(spouseText);
    if (childrenText) relationshipTexts.push(childrenText);
    if (siblingsText) relationshipTexts.push(siblingsText);
    if (brothersSistersText) relationshipTexts.push(brothersSistersText);
    if (inLawsText) relationshipTexts.push(inLawsText);

    // Add custom relationships
    if (customRelationshipsTexts.length > 0) {
      relationshipTexts.push(...customRelationshipsTexts);
    }

    // Display other relatives (not الابن, البنت, الزوج, النسيب, أخرى, or siblings)
    let otherRelatives = [];
    formData.relatives.forEach((relative) => {
      if (
        relative.relationship &&
        relative.relationship !== "الابن" &&
        relative.relationship !== "البنت" &&
        relative.relationship !== "الزوج" &&
        relative.relationship !== "النسيب" &&
        relative.relationship !== "أخرى" &&
        relative.relationship !== "الشقيق الأخ" &&
        relative.relationship !== "الشقيق الأخت" &&
        relative.relationship !== "الأخ الشقيق" &&
        relative.relationship !== "الأخت الشقيقة" &&
        relative.relationship !== "الأخ" &&
        relative.relationship !== "الأخ" &&
        relative.relationship !== "الأخت" &&
        relative.names &&
        relative.names.length > 0
      ) {
        const relationship = relative.relationship;
        const validNames = relative.names.filter(
          (nameObj) => nameObj.name && nameObj.name.trim()
        );
        if (validNames.length > 0) {
          const namesDisplay = validNames
            .map((nameObj) => {
              const name = nameObj.name.trim();
              return nameObj.isDeceased ? `${name} (رحمه الله)` : name;
            })
            .join(", ");
          otherRelatives.push(`${relationship}: ${namesDisplay}`);
        }
      }
    });

    // Add other relatives as a single text block if they exist
    if (otherRelatives.length > 0) {
      relationshipTexts.push(otherRelatives.join(" و "));
    }

    // Return as HTML with " و " between different relationship types
    return (
      <>
        {relationshipTexts.map((text, index) => (
          <span key={index}>
            {index > 0 && <span> و </span>}
            {text === spouseText ||
            text === inLawsText ||
            text === childrenText ||
            text === siblingsText ||
            text === brothersSistersText ||
            customRelationshipsTexts.includes(text) ? (
              <span dangerouslySetInnerHTML={{ __html: text }} />
            ) : (
              <span>{text}</span>
            )}
          </span>
        ))}
      </>
    );
  }, [formData.relatives, formData.gender]);

  // Function to render burial section that can be moved between containers
  const renderBurialSection = () => {
    return (
      <div className="burial-section">
        <span>
          {formData.skipBurialDetails ? (
            <span className="tafasel-aldafan  header-label pr-1">
              <i className="fa-solid fa-hourglass-start header-icon"></i>
              سيتم تحديد تفاصيل الدفن لاحقًا إن شاء الله
            </span>
          ) : formData.burialCompleted ? (
            <span className="tafasel-aldafan  header-label pr-1">
              <i className="fa-solid fa-hourglass-start header-icon"></i>
              تم الدفن
            </span>
          ) : (
            <div className="burial-details">
              {/* Burial Date */}
              {formData.deathDateGregorian && (
                <div className="burial-date">
                  <i className="fa-solid fa-calendar-days header-icon"></i>
                  الدفن يوم{" "}
                  <span style={{ fontWeight: "700", color: "#c40000" }}>
                    {(() => {
                      const date = new Date(formData.deathDateGregorian);
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
                    })()}
                  </span>{" "}
                  بتاريخ{" "}
                  <span style={{ fontWeight: "bold", color: "#c40000" }}>
                    {(() => {
                      const hijriMoment = moment(formData.deathDateGregorian);
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
                    })()}
                  </span>{" "}
                  الموافق{" "}
                  <span style={{ fontWeight: "bold", color: "#c40000" }}>
                    {(() => {
                      const date = new Date(formData.deathDateGregorian);
                      const arabicMonths = [
                        "يناير",
                        "فبراير",
                        "مارس",
                        "أبريل",
                        "مايو",
                        "يونيو",
                        "يوليو",
                        "أغسطس",
                        "سبتمبر",
                        "أكتوبر",
                        "نوفمبر",
                        "ديسمبر",
                      ];
                      const day = date.getDate();
                      const month = arabicMonths[date.getMonth()];
                      const year = date.getFullYear();
                      return `${day} ${month} ${year}م`;
                    })()}
                  </span>
                </div>
              )}

              {/* Burial Location and Time - show together when both exist */}
              {(formData.burialLocation || formData.customBurialLocation) && (
                <div className="burial-location-container">
                  {/* Burial Location with Time on same line */}
                  <div className="burial-location">
                    <i className="fa-solid fa-location-dot header-icon"></i> في{" "}
                    <span style={{ fontWeight: "bold", color: "#c40000" }}>
                      {(() => {
                        let locationName =
                          formData.burialLocation === "خارج البحرين" &&
                          formData.customBurialLocation
                            ? formData.customBurialLocation
                            : formData.burialLocation;

                        // Remove "للأوقاف السنية" suffix if it exists
                        if (
                          locationName &&
                          locationName.endsWith(" للأوقاف السنية")
                        ) {
                          locationName = locationName.replace(
                            " للأوقاف السنية",
                            ""
                          );
                        }

                        return locationName;
                      })()}
                    </span>
                    {(() => {
                      // Add grave details if both number and section are provided
                      if (formData.graveNumber && formData.graveSection) {
                        return (
                          <span
                            style={{ fontWeight: "bold", color: "#c40000" }}
                          >
                            {" "}
                            قبر رقم {formData.graveNumber} قطعة{" "}
                            {formData.graveSection}
                          </span>
                        );
                      }
                      return "";
                    })()}
                    {formData.burialTimeType &&
                      formData.burialTimeValue &&
                      (() => {
                        // Burial Time - on same line right after cemetery
                        if (formData.burialTimeType === "after_prayer") {
                          return (
                            <>
                              {" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                {formData.burialTimeValue}
                              </span>
                            </>
                          );
                        } else if (formData.burialTimeType === "completed") {
                          return (
                            <>
                              {" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                تم الدفن
                              </span>
                            </>
                          );
                        } else if (formData.burialTimeType === "manual") {
                          // Convert time to Arabic time period
                          const time = formData.burialTimeValue;

                          // Validate time format and split
                          if (
                            !time ||
                            typeof time !== "string" ||
                            !time.includes(":")
                          ) {
                            return (
                              <>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#c40000",
                                  }}
                                >
                                  {formData.burialTimeValue}
                                </span>
                              </>
                            );
                          }

                          const timeParts = time.split(":");
                          if (timeParts.length !== 2) {
                            return (
                              <>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#c40000",
                                  }}
                                >
                                  {formData.burialTimeValue}
                                </span>
                              </>
                            );
                          }

                          const hours = parseInt(timeParts[0]);
                          const minutes = parseInt(timeParts[1]);

                          // Validate parsed numbers
                          if (isNaN(hours) || isNaN(minutes)) {
                            return (
                              <>
                                {" "}
                                وقت الدفن{" "}
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: "#c40000",
                                  }}
                                >
                                  {formData.burialTimeValue}
                                </span>
                              </>
                            );
                          }

                          const totalMinutes = hours * 60 + minutes;

                          let period = "";
                          let displayTime = "";

                          // Determine period based on time ranges
                          if (totalMinutes >= 240 && totalMinutes < 360) {
                            // 4:00 AM - 6:00 AM
                            period = "فجرًا";
                          } else if (
                            totalMinutes >= 360 &&
                            totalMinutes < 720
                          ) {
                            // 6:00 AM - 12:00 PM
                            period = "صباحًا";
                          } else if (
                            totalMinutes >= 720 &&
                            totalMinutes < 900
                          ) {
                            // 12:00 PM - 3:00 PM
                            period = "ظهرًا";
                          } else if (
                            totalMinutes >= 900 &&
                            totalMinutes < 1020
                          ) {
                            // 3:00 PM - 5:00 PM
                            period = "عصرًا"; // Fixed typo
                          } else if (
                            totalMinutes >= 1020 &&
                            totalMinutes < 1260
                          ) {
                            // 5:00 PM - 9:00 PM
                            period = "مساءً";
                          } else if (
                            totalMinutes >= 1260 ||
                            totalMinutes < 240
                          ) {
                            // 9:00 PM - 4:00 AM
                            period = "ليلًا";
                          }

                          // Format display time with proper validation
                          if (hours === 0) {
                            displayTime = `12:${minutes
                              .toString()
                              .padStart(2, "0")}`;
                          } else if (hours > 12) {
                            displayTime = `${hours - 12}:${minutes
                              .toString()
                              .padStart(2, "0")}`;
                          } else {
                            displayTime = `${hours}:${minutes
                              .toString()
                              .padStart(2, "0")}`;
                          }

                          return (
                            <>
                              {" "}
                              وقت الدفن{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                {displayTime} {period}
                              </span>
                            </>
                          );
                        }
                        return (
                          <>
                            {" "}
                            وقت الدفن{" "}
                            <span
                              style={{ fontWeight: "bold", color: "#c40000" }}
                            >
                              {formData.burialTimeValue}
                            </span>
                          </>
                        );
                      })()}
                  </div>
                </div>
              )}

              {/* Burial Time only (if no location but time exists) */}
              {!(formData.burialLocation || formData.customBurialLocation) &&
                formData.burialTimeType &&
                formData.burialTimeValue && (
                  <div className="burial-time">
                    <i className="fa-solid fa-clock header-icon"></i>{" "}
                    {(() => {
                      if (formData.burialTimeType === "after_prayer") {
                        return (
                          <>
                            وقت الدفن{" "}
                            <span
                              style={{ fontWeight: "bold", color: "#c40000" }}
                            >
                              {formData.burialTimeValue}
                            </span>
                          </>
                        );
                      } else if (formData.burialTimeType === "completed") {
                        return (
                          <>
                            <span
                              style={{ fontWeight: "bold", color: "#c40000" }}
                            >
                              تم الدفن
                            </span>
                          </>
                        );
                      } else if (formData.burialTimeType === "manual") {
                        // Convert time to Arabic time period
                        const time = formData.burialTimeValue;

                        // Validate time format and split
                        if (
                          !time ||
                          typeof time !== "string" ||
                          !time.includes(":")
                        ) {
                          return (
                            <>
                              وقت الدفن{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                {formData.burialTimeValue}
                              </span>
                            </>
                          );
                        }

                        const timeParts = time.split(":");
                        if (timeParts.length !== 2) {
                          return (
                            <>
                              وقت الدفن{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                {formData.burialTimeValue}
                              </span>
                            </>
                          );
                        }

                        const hours = parseInt(timeParts[0]);
                        const minutes = parseInt(timeParts[1]);

                        // Validate parsed numbers
                        if (isNaN(hours) || isNaN(minutes)) {
                          return (
                            <>
                              وقت الدفن{" "}
                              <span
                                style={{ fontWeight: "bold", color: "#c40000" }}
                              >
                                {formData.burialTimeValue}
                              </span>
                            </>
                          );
                        }

                        const totalMinutes = hours * 60 + minutes;

                        let period = "";
                        let displayTime = "";

                        // Determine period based on time ranges
                        if (totalMinutes >= 240 && totalMinutes < 360) {
                          // 4:00 AM - 6:00 AM
                          period = "فجرًا";
                        } else if (totalMinutes >= 360 && totalMinutes < 720) {
                          // 6:00 AM - 12:00 PM
                          period = "صباحًا";
                        } else if (totalMinutes >= 720 && totalMinutes < 900) {
                          // 12:00 PM - 3:00 PM
                          period = "ظهرًا";
                        } else if (totalMinutes >= 900 && totalMinutes < 1020) {
                          // 3:00 PM - 5:00 PM
                          period = "عصرًا"; // Fixed typo
                        } else if (
                          totalMinutes >= 1020 &&
                          totalMinutes < 1260
                        ) {
                          // 5:00 PM - 9:00 PM
                          period = "مساءً";
                        } else if (totalMinutes >= 1260 || totalMinutes < 240) {
                          // 9:00 PM - 4:00 AM
                          period = "ليلًا";
                        }

                        // Format display time with proper validation
                        if (hours === 0) {
                          displayTime = `12:${minutes
                            .toString()
                            .padStart(2, "0")}`;
                        } else if (hours > 12) {
                          displayTime = `${hours - 12}:${minutes
                            .toString()
                            .padStart(2, "0")}`;
                        } else {
                          displayTime = `${hours}:${minutes
                            .toString()
                            .padStart(2, "0")}`;
                        }

                        return (
                          <>
                            وقت الدفن{" "}
                            <span
                              style={{ fontWeight: "bold", color: "#c40000" }}
                            >
                              {displayTime} {period}
                            </span>
                          </>
                        );
                      }
                      return (
                        <>
                          وقت الدفن{" "}
                          <span
                            style={{ fontWeight: "bold", color: "#c40000" }}
                          >
                            {formData.burialTimeValue}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                )}
            </div>
          )}
        </span>
      </div>
    );
  };

  const renderCondolence = () => {
    return (
      <>
        {/* Condolence Location for Men */}
        {formData.condolenceLocationMen && (
          <div className="info-item-grid">
            <span>
              <div className="condolence">
                <i className="fa-solid fa-house header-icon"></i>{" "}
                <span className="header-label">التعازي للرجال</span> في{" "}
                <span style={{ fontWeight: "bold", color: "#c40000" }}>
                  {formData.condolenceLocationMen}
                </span>
                {(() => {
                  // Get the correct condolence times data
                  const condolenceTimes = formData.condolenceTimesMen || [];

                  if (!condolenceTimes || condolenceTimes.length === 0) {
                    return "";
                  }

                  // Helper function to format time with improved prayer time handling
                  const formatTime = (timeStr, type) => {
                    if (type === "prayer" || type === "بعد صلاة") {
                      // Handle prayer times - ensure proper Arabic format
                      if (typeof timeStr === "string") {
                        if (timeStr.includes("بعد صلاة")) {
                          return timeStr; // Already formatted like "بعد صلاة الفجر"
                        } else if (timeStr.includes("صلاة")) {
                          return timeStr; // Already formatted like "صلاة الفجر"
                        } else {
                          // Add "بعد صلاة" prefix if not present
                          return `بعد صلاة ${timeStr}`;
                        }
                      }
                      return timeStr;
                    } else if (type === "manual" || type === "وقت محدد") {
                      // Convert time to Arabic format
                      if (!timeStr || !timeStr.includes(":")) return timeStr;

                      const [hours, minutes] = timeStr.split(":").map(Number);
                      if (isNaN(hours) || isNaN(minutes)) return timeStr;

                      const totalMinutes = hours * 60 + minutes;
                      let period = "";
                      let displayTime = "";

                      // Determine period
                      if (totalMinutes >= 240 && totalMinutes < 360) {
                        period = "فجرًا";
                      } else if (totalMinutes >= 360 && totalMinutes < 720) {
                        period = "صباحًا";
                      } else if (totalMinutes >= 720 && totalMinutes < 900) {
                        period = "ظهرًا";
                      } else if (totalMinutes >= 900 && totalMinutes < 1020) {
                        period = "عصرًا";
                      } else if (totalMinutes >= 1020 && totalMinutes < 1260) {
                        period = "مساءً";
                      } else if (totalMinutes >= 1260 || totalMinutes < 240) {
                        period = "ليلًا";
                      }

                      // Format display time
                      if (hours === 0) {
                        displayTime = `12:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      } else if (hours > 12) {
                        displayTime = `${hours - 12}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      } else {
                        displayTime = `${hours}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      }

                      return `الساعة ${displayTime} ${period}`;
                    }
                    return timeStr;
                  };

                  // Helper function to get day order
                  const getDayOrder = (day) => {
                    const dayOrder = {
                      السبت: 0,
                      الأحد: 1,
                      الاثنين: 2,
                      الثلاثاء: 3,
                      الأربعاء: 4,
                      الخميس: 5,
                      الجمعة: 6,
                    };
                    return dayOrder[day] || 7;
                  };

                  // Process the correct data structure
                  const timeGroups = {};
                  condolenceTimes.forEach((entry) => {
                    console.log("Processing condolence entry:", entry);

                    if (
                      !entry ||
                      !entry.day ||
                      !entry.timeRanges ||
                      !Array.isArray(entry.timeRanges)
                    ) {
                      console.log("Skipping invalid entry:", entry);
                      return;
                    }

                    // Convert timeRanges to timeIntervals format for consistency
                    const timeIntervals = entry.timeRanges.map((range) => ({
                      startTime: range.from,
                      startType: range.fromType,
                      endTime: range.to,
                      endType: range.toType,
                    }));

                    // Create a key based on time intervals
                    const timeKey = timeIntervals
                      .map(
                        (interval) =>
                          `${formatTime(
                            interval.startTime,
                            interval.startType
                          )}-${formatTime(interval.endTime, interval.endType)}`
                      )
                      .join("|");

                    if (!timeGroups[timeKey]) {
                      timeGroups[timeKey] = {
                        days: [],
                        intervals: timeIntervals,
                      };
                    }
                    timeGroups[timeKey].days.push(entry.day);
                  });

                  console.log("Time groups:", timeGroups);

                  // Sort and format each group
                  const formattedGroups = Object.values(timeGroups).map(
                    (group) => {
                      // Sort days
                      const sortedDays = group.days.sort(
                        (a, b) => getDayOrder(a) - getDayOrder(b)
                      );

                      // Format days with correct grammar and styling
                      let dayText = "";
                      if (sortedDays.length === 1) {
                        dayText = `يوم <span style="font-weight: bold; color: #c40000">${sortedDays[0]}</span>`;
                      } else if (sortedDays.length === 2) {
                        dayText = `يومي <span style="font-weight: bold; color: #c40000">${sortedDays[0]}</span> و <span style="font-weight: bold; color: #c40000">${sortedDays[1]}</span>`;
                      } else {
                        const lastDay = sortedDays.pop();
                        const styledDays = sortedDays
                          .map(
                            (day) =>
                              `<span style="font-weight: bold; color: #c40000">${day}</span>`
                          )
                          .join(" و ");
                        dayText = `أيام ${styledDays} و <span style="font-weight: bold; color: #c40000">${lastDay}</span>`;
                      }

                      // Format time intervals with improved handling
                      const intervalTexts = group.intervals.map((interval) => {
                        const startTime = formatTime(
                          interval.startTime,
                          interval.startType
                        );
                        const endTime = formatTime(
                          interval.endTime,
                          interval.endType
                        );

                        // Handle special case where start and end are both prayers
                        if (
                          (interval.startType === "prayer" ||
                            interval.startType === "بعد صلاة") &&
                          (interval.endType === "prayer" ||
                            interval.endType === "بعد صلاة")
                        ) {
                          // For prayer to prayer: "من بعد صلاة الفجر حتى صلاة العشاء"
                          return `من ${startTime} حتى ${endTime.replace(
                            "بعد ",
                            ""
                          )}`;
                        } else {
                          // For other combinations: "من ... الى ..."
                          return `من ${startTime} الى ${endTime}`;
                        }
                      });

                      return `${dayText} ${intervalTexts.join(" و ")}`;
                    }
                  );

                  console.log("Formatted groups:", formattedGroups);

                  return formattedGroups.length > 0 ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ` و ذلك في ${formattedGroups.join(" و ")}`,
                      }}
                    />
                  ) : (
                    ""
                  );
                })()}
              </div>
            </span>
          </div>
        )}

        {/* Condolence Location for Women */}
        {formData.condolenceLocationWomen && (
          <div className="info-item-grid">
            <span>
              <div className="condolence">
                <i className="fa-solid fa-house header-icon"></i>{" "}
                <span className="header-label">التعازي للنساء</span> في{" "}
                <span style={{ fontWeight: "bold", color: "#c40000" }}>
                  {formData.condolenceLocationWomen}
                </span>
                {(() => {
                  // Get the correct condolence times data
                  const condolenceTimes = formData.condolenceTimesWomen || [];

                  if (!condolenceTimes || condolenceTimes.length === 0) {
                    return "";
                  }

                  // Helper function to format time with improved prayer time handling
                  const formatTime = (timeStr, type) => {
                    if (type === "prayer" || type === "بعد صلاة") {
                      // Handle prayer times - ensure proper Arabic format
                      if (typeof timeStr === "string") {
                        if (timeStr.includes("بعد صلاة")) {
                          return timeStr; // Already formatted like "بعد صلاة الفجر"
                        } else if (timeStr.includes("صلاة")) {
                          return timeStr; // Already formatted like "صلاة الفجر"
                        } else {
                          // Add "بعد صلاة" prefix if not present
                          return `بعد صلاة ${timeStr}`;
                        }
                      }
                      return timeStr;
                    } else if (type === "manual" || type === "وقت محدد") {
                      // Convert time to Arabic format
                      if (!timeStr || !timeStr.includes(":")) return timeStr;

                      const [hours, minutes] = timeStr.split(":").map(Number);
                      if (isNaN(hours) || isNaN(minutes)) return timeStr;

                      const totalMinutes = hours * 60 + minutes;
                      let period = "";
                      let displayTime = "";

                      // Determine period
                      if (totalMinutes >= 240 && totalMinutes < 360) {
                        period = "فجرًا";
                      } else if (totalMinutes >= 360 && totalMinutes < 720) {
                        period = "صباحًا";
                      } else if (totalMinutes >= 720 && totalMinutes < 900) {
                        period = "ظهرًا";
                      } else if (totalMinutes >= 900 && totalMinutes < 1020) {
                        period = "عصرًا";
                      } else if (totalMinutes >= 1020 && totalMinutes < 1260) {
                        period = "مساءً";
                      } else if (totalMinutes >= 1260 || totalMinutes < 240) {
                        period = "ليلًا";
                      }

                      // Format display time
                      if (hours === 0) {
                        displayTime = `12:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      } else if (hours > 12) {
                        displayTime = `${hours - 12}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      } else {
                        displayTime = `${hours}:${minutes
                          .toString()
                          .padStart(2, "0")}`;
                      }

                      return `الساعة ${displayTime} ${period}`;
                    }
                    return timeStr;
                  };

                  // Helper function to get day order
                  const getDayOrder = (day) => {
                    const dayOrder = {
                      السبت: 0,
                      الأحد: 1,
                      الاثنين: 2,
                      الثلاثاء: 3,
                      الأربعاء: 4,
                      الخميس: 5,
                      الجمعة: 6,
                    };
                    return dayOrder[day] || 7;
                  };

                  // Process the correct data structure
                  const timeGroups = {};
                  condolenceTimes.forEach((entry) => {
                    console.log("Processing condolence entry:", entry);

                    if (
                      !entry ||
                      !entry.day ||
                      !entry.timeRanges ||
                      !Array.isArray(entry.timeRanges)
                    ) {
                      console.log("Skipping invalid entry:", entry);
                      return;
                    }

                    // Convert timeRanges to timeIntervals format for consistency
                    const timeIntervals = entry.timeRanges.map((range) => ({
                      startTime: range.from,
                      startType: range.fromType,
                      endTime: range.to,
                      endType: range.toType,
                    }));

                    // Create a key based on time intervals
                    const timeKey = timeIntervals
                      .map(
                        (interval) =>
                          `${formatTime(
                            interval.startTime,
                            interval.startType
                          )}-${formatTime(interval.endTime, interval.endType)}`
                      )
                      .join("|");

                    if (!timeGroups[timeKey]) {
                      timeGroups[timeKey] = {
                        days: [],
                        intervals: timeIntervals,
                      };
                    }
                    timeGroups[timeKey].days.push(entry.day);
                  });

                  console.log("Time groups:", timeGroups);

                  // Sort and format each group
                  const formattedGroups = Object.values(timeGroups).map(
                    (group) => {
                      // Sort days
                      const sortedDays = group.days.sort(
                        (a, b) => getDayOrder(a) - getDayOrder(b)
                      );

                      // Format days with correct grammar and styling
                      let dayText = "";
                      if (sortedDays.length === 1) {
                        dayText = `يوم <span style="font-weight: bold; color: #c40000">${sortedDays[0]}</span>`;
                      } else if (sortedDays.length === 2) {
                        dayText = `يومي <span style="font-weight: bold; color: #c40000">${sortedDays[0]}</span> و <span style="font-weight: bold; color: #c40000">${sortedDays[1]}</span>`;
                      } else {
                        const lastDay = sortedDays.pop();
                        const styledDays = sortedDays
                          .map(
                            (day) =>
                              `<span style="font-weight: bold; color: #c40000">${day}</span>`
                          )
                          .join(" و ");
                        dayText = `أيام ${styledDays} و <span style="font-weight: bold; color: #c40000">${lastDay}</span>`;
                      }

                      // Format time intervals with improved handling
                      const intervalTexts = group.intervals.map((interval) => {
                        const startTime = formatTime(
                          interval.startTime,
                          interval.startType
                        );
                        const endTime = formatTime(
                          interval.endTime,
                          interval.endType
                        );

                        // Handle special case where start and end are both prayers
                        if (
                          (interval.startType === "prayer" ||
                            interval.startType === "بعد صلاة") &&
                          (interval.endType === "prayer" ||
                            interval.endType === "بعد صلاة")
                        ) {
                          // For prayer to prayer: "من بعد صلاة الفجر حتى صلاة العشاء"
                          return `من ${startTime} حتى ${endTime.replace(
                            "بعد ",
                            ""
                          )}`;
                        } else {
                          // For other combinations: "من ... الى ..."
                          return `من ${startTime} الى ${endTime}`;
                        }
                      });

                      return `${dayText} ${intervalTexts.join(" و ")}`;
                    }
                  );

                  console.log("Formatted groups:", formattedGroups);

                  return formattedGroups.length > 0 ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: ` و ذلك في ${formattedGroups.join(" و ")}`,
                      }}
                    />
                  ) : (
                    ""
                  );
                })()}
              </div>
            </span>
          </div>
        )}
      </>
    );
  };

  const getAdditionalElements = useCallback(() => {
    const elements = [];

    // 1. Relatives
    const relativesContent = displayRelatives();
    if (relativesContent) {
      elements.push({
        id: "relatives",
        content: (
          <div className="additional-text">
            <i className="fas fa-users header-icon"></i>
            <span className="header-label">الأقارب: </span>
            {relativesContent}
          </div>
        ),
      });
    }

    // 2. Burial information - USE THE NEW RENDER FUNCTION
    if (
      formData.skipBurialDetails ||
      formData.burialCompleted ||
      formData.deathDateGregorian ||
      formData.burialLocation ||
      formData.customBurialLocation ||
      (formData.burialTimeType && formData.burialTimeValue)
    ) {
      elements.push({
        id: "burial-section",
        content: renderBurialSection(),
      });
    }

    // 3. Condolence locations - use the full renderCondolence function
    if (formData.condolenceLocationMen || formData.condolenceLocationWomen) {
      elements.push({
        id: "condolence-section",
        content: renderCondolence(),
      });
    }

    // 4. Contact numbers
    if (formData.contactNumbers && formData.contactNumbers.length > 0) {
      const contacts = formData.contactNumbers
        .filter((contact) => contact.name && contact.phone)
        .map((contact) => `${contact.name}: ${contact.phone}`)
        .join(" - ");

      if (contacts) {
        elements.push({
          id: "contacts",
          content: (
            <div className="additional-text">
              <i className="fas fa-phone header-icon"></i>
              <span className="header-label">أرقام التواصل: </span>
              {formData.contactNumbers.map((contact, index) => (
                <span key={index}>
                  {contact.name && contact.phone && (
                    <>
                      {index > 0 && <span> - </span>}
                      <span>
                        {contact.name} {contact.phone}
                      </span>
                    </>
                  )}
                </span>
              ))}
            </div>
          ),
        });
      }
    }

    return elements;
  }, [
    formData.skipBurialDetails,
    formData.burialCompleted,
    formData.deathDateGregorian,
    formData.burialLocation,
    formData.customBurialLocation,
    formData.burialTimeType,
    formData.burialTimeValue,
    formData.condolenceLocationMen,
    formData.condolenceLocationWomen,
    formData.contactNumbers,
    displayRelatives,
    renderBurialSection,
    renderCondolence,
  ]);

  // React-friendly distribution based on actual top-content elements
  const distributeElementsByHeight = useCallback(() => {
    const allElements = getAdditionalElements();

    if (allElements.length === 0) {
      setContentDistribution({ topElements: [], bottomElements: [] });
      return;
    }

    // Count removable elements in top-content (age and occupation)
    const hasAge = formData.age && formData.age.trim().length > 0;
    const hasOccupation = formData.status && formData.status.trim().length > 0;

    let elementsToAddOnTop = 0;

    if (!hasAge && !hasOccupation) {
      // No removable elements - add 3 elements on top
      elementsToAddOnTop = 3;
    } else if ((hasAge && !hasOccupation) || (!hasAge && hasOccupation)) {
      // One removable element exists - add 2 elements on top
      elementsToAddOnTop = 2;
    } else {
      // Both removable elements exist - add 1 element on top
      elementsToAddOnTop = 1;
    }

    // Ensure we don't exceed available elements
    elementsToAddOnTop = Math.min(elementsToAddOnTop, allElements.length);

    setContentDistribution({
      topElements: allElements.slice(0, elementsToAddOnTop),
      bottomElements: allElements.slice(elementsToAddOnTop),
    });
  }, [formData.age, formData.status, getAdditionalElements]);

  // Effect to redistribute elements when content changes
  useEffect(() => {
    // Add a small delay to ensure state is stable
    const timeoutId = setTimeout(() => {
      distributeElementsByHeight();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [
    // Only depend on essential form data, not the entire formData object
    formData.relatives?.length,
    formData.skipBurialDetails,
    formData.burialCompleted,
    formData.deathDateGregorian,
    formData.burialLocation,
    formData.condolenceLocationMen,
    formData.condolenceLocationWomen,
    formData.contactNumbers?.length,
    formData.photo,
    formData.age,
    formData.status,
    distributeElementsByHeight,
  ]);

  return (
    <div className="preview-wrapper">
      <div className="islamic-dead-container">
        <div
          className={`islamic-dead-card ${!hasPhoto() ? "no-photo" : ""}`}
          style={{
            "--top-content-font-size-increase": `${fontSizeIncrease}px`,
            "--additional-content-increase": `${additionalFontSizeIncrease}px`,
          }}
        >
          {/* Logo positioned absolutely in top right */}
          <div className="tawasul-logo-rip">
            <img src="/islamic-memorial/tawasul.png" alt="شعار أهل البحرين" />
          </div>

          {/* Ina lilah image - FIXED POSITIONING */}
          <img
            src="/islamic-memorial/ina-org.png"
            alt="إنا لله وإنا إليه راجعون"
            className="ina-lilah-top"
          />

          {/* Photo positioned absolutely */}
          {getPhotoUrl() && (
            <img
              src={getPhotoUrl()}
              alt="الفقيد"
              className="tawasul-photo-rip"
            />
          )}

          {/* Main content */}
          <div className="dead-top-content" ref={topContentRef}>
            {/* Transition text section */}
            <div className="transition-section">
              <div className="transition-text">{displayTransitionText()}</div>
            </div>
            {/* Age section */}
            {formData.age && (
              <div className="age-section">
                <div className="age-text">{displayAge()}</div>
              </div>
            )}
            {/* Name section */}
            {formData.name && (
              <div className="name-section">
                <div className="deceased-name"> {formData.name} </div>
              </div>
            )}
            {/* Occupation section */}
            {formData.status && (
              <div className="occupation-section">
                <div className="occupation-text">{formData.status}</div>
              </div>
            )}
            {/* Extra content - elements that fit based on height */}
            <div className="top-extra-content" ref={extraContentRef}>
              {contentDistribution.topElements.map((element) => (
                <div key={element.id} className="top-additional-section">
                  <div className="top-additional-text">{element.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom content - elements that don't fit in top */}
          {contentDistribution.bottomElements.length > 0 && (
            <div className="dead-bottom-content">
              {contentDistribution.bottomElements.map((element) => (
                <div key={element.id} className="bottom-additional-section">
                  <div className="bottom-additional-text">
                    {element.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IslamicdeadPreview_v2;
