import React from "react";
import bgUrl from "../svg/Tawasul Bahrain - Prayer Times.svg";
import "./prayerTimePreview.css";

const LABELS = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
  lastThird: "الثلث الأخير",
};

// 24h -> 12h with Arabic ص/م (NBSP keeps on one line)
const to12h = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":").map(Number);
  const p = h >= 12 ? "م" : "ص";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${String(m).padStart(2, "0")}\u00A0${p}`;
};

export default function PrayerTimePreview({ date, hijriDate, prayerTimes = {} }) {
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "lastThird"];

  return (
    <div className="prayer-card" dir="rtl">
      {/* Background illustration */}
      <div className="prayer-card__bg">
        <img
          src={bgUrl}
          alt="Prayer Times Background"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add("prayer-card__bg--fallback");
          }}
        />
      </div>

      {/* Dates (under the brush heading) */}
      <div className="prayer-card__dates">
        <div className="prayer-card__hijri">{hijriDate || ""}</div>
        <div className="prayer-card__greg">{date || ""}</div>
      </div>

      {/* Right column: label (black) | time (red) */}
      <div className="prayer-card__rows">
        {order.filter((k) => prayerTimes[k]).map((k) => (
          <div className="prayer-card__row" key={k}>
            <div className="prayer-card__label">{LABELS[k]}</div>
            <div className="prayer-card__time">{to12h(prayerTimes[k])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
