// src/components/forms/PrayerTimeForm.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import PrayerTimePreview from "../previews/PrayerTimePreview";
import DownloadButton from "../DownloadButton"; // <- shared button

const PrayerTimeViewer = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hijriDate, setHijriDate] = useState("");

  // capture target (the big square preview)
  const previewRef = useRef(null);

  const prayerNames = {
    lastThird: "الثلث الأخير",
    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
  };

  // Calculate last third of the night
  const calculateLastThird = useCallback((maghribTime, fajrTime) => {
    if (!maghribTime || !fajrTime) return null;
    const [mh, mm] = maghribTime.split(":").map(Number);
    const [fh, fm] = fajrTime.split(":").map(Number);
    let mMin = mh * 60 + mm;
    let fMin = fh * 60 + fm;
    if (fMin < mMin) fMin += 24 * 60; // next day
    const night = fMin - mMin;
    const lastThirdStart = mMin + (night * 2) / 3;
    const h = Math.floor(lastThirdStart / 60) % 24;
    const min = Math.round(lastThirdStart % 60);
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }, []);

  // Load prayer times (Aladhan API, Umm al-Qura)
  const loadPrayerTimes = useCallback(async () => {
    try {
      setLoading(true);
      const d = String(currentDate.getDate()).padStart(2, "0");
      const m = String(currentDate.getMonth() + 1).padStart(2, "0");
      const y = currentDate.getFullYear();
      const dateString = `${d}-${m}-${y}`;

      const latitude = 26.0667; // Manama
      const longitude = 50.5577;
      const timezone = "Asia/Bahrain";

      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=4&school=0&midnightMode=0&timezonestring=${timezone}&adjustment=0&tune=0,0,0,0,0,0,0,0,0`
      );
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();

      if (data.code === 200) {
        const t = data.data.timings;
        const hijri = data.data.date.hijri;

        const lastThird = calculateLastThird(t.Maghrib, t.Fajr);
        setPrayerTimes({
          lastThird,
          fajr: t.Fajr.substring(0, 5),
          sunrise: t.Sunrise.substring(0, 5),
          dhuhr: t.Dhuhr.substring(0, 5),
          asr: t.Asr.substring(0, 5),
          maghrib: t.Maghrib.substring(0, 5),
          isha: t.Isha.substring(0, 5),
        });
        setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`);
      } else {
        setPrayerTimes(null);
        setHijriDate("");
      }
    } catch (e) {
      console.error("Error loading prayer times:", e);
      setPrayerTimes(null);
      setHijriDate("");
    } finally {
      setLoading(false);
    }
  }, [currentDate, calculateLastThird]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  const formatDateDisplay = useCallback((date) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("ar-BH", options);
  }, []);

  const handleDateChange = useCallback(
    (days) => {
      const nd = new Date(currentDate.getTime());
      nd.setDate(nd.getDate() + days);
      setCurrentDate(nd);
    },
    [currentDate]
  );

  const goToPreviousDay = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    handleDateChange(-1);
  }, [handleDateChange]);

  const goToNextDay = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    handleDateChange(1);
  }, [handleDateChange]);

  const goToToday = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setCurrentDate(new Date());
  }, []);

  const getCurrentPrayer = useCallback(() => {
    if (!prayerTimes) return null;
    const now = new Date();
    const cur = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const list = [
      { name: "lastThird", time: prayerTimes.lastThird, label: prayerNames.lastThird },
      { name: "fajr", time: prayerTimes.fajr, label: prayerNames.fajr },
      { name: "sunrise", time: prayerTimes.sunrise, label: prayerNames.sunrise },
      { name: "dhuhr", time: prayerTimes.dhuhr, label: prayerNames.dhuhr },
      { name: "asr", time: prayerTimes.asr, label: prayerNames.asr },
      { name: "maghrib", time: prayerTimes.maghrib, label: prayerNames.maghrib },
      { name: "isha", time: prayerTimes.isha, label: prayerNames.isha },
    ];
    for (let i = 0; i < list.length; i++) {
      if (cur < list[i].time) {
        return { current: i > 0 ? list[i - 1] : null, next: list[i] };
      }
    }
    return { current: list[list.length - 1], next: list[0] }; // next day lastThird
  }, [prayerTimes]);

  const getTimeUntilNext = useCallback((nextPrayerTime) => {
    if (!nextPrayerTime) return "";
    const now = new Date();
    const [h, m] = nextPrayerTime.split(":").map(Number);
    const next = new Date();
    next.setHours(h, m, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const diff = next - now;
    const H = Math.floor(diff / 36e5);
    const M = Math.floor((diff % 36e5) / 6e4);
    return H > 0 ? `${H} ساعة و ${M} دقيقة` : `${M} دقيقة`;
  }, []);

  const isToday = useCallback(() => {
    const today = new Date();
    return currentDate.toDateString() === today.toDateString();
  }, [currentDate]);

  const currentPrayerInfo = isToday() ? getCurrentPrayer() : null;

  // safe filename like "prayer-times-2025-08-24.png"
  const dlName = `prayer-times-${currentDate.toLocaleDateString("en-CA")}.png`;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-islamic-gold border-t-transparent"></div>
        <p className="mr-3 text-islamic-green">جاري تحميل مواقيت الصلاة...</p>
      </div>
    );
  }

  return (
    <div className="islamic-container">
      <div className="islamic-content">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-islamic-green font-amiri">مواقيت الصلاة - أم القرى</h1>
          <div className="w-16" />
        </div>

        {/* Compact list (kept as-is) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-islamic-gold/20">
          <div className="bg-islamic-green text-white p-3 text-center flex items-center justify-between">
            <button type="button" onClick={goToPreviousDay}
              className="bg-islamic-gold/80 text-white px-3 py-2 rounded-lg text-sm hover:bg-islamic-gold transition-colors flex items-center gap-1"
              disabled={loading}>
              <i className="fas fa-chevron-right" />
              <span className="text-xs">أمس</span>
            </button>

            <div className="text-center mx-2 flex-1">
              <p className="font-cairo text-sm">{formatDateDisplay(currentDate)}</p>
              {hijriDate && <p className="font-cairo text-xs text-islamic-gold">{hijriDate}</p>}
            </div>

            <button type="button" onClick={goToNextDay}
              className="bg-islamic-gold/80 text-white px-3 py-2 rounded-lg text-sm hover:bg-islamic-gold transition-colors flex items-center gap-1"
              disabled={loading}>
              <span className="text-xs">غداً</span>
              <i className="fas fa-chevron-left" />
            </button>
          </div>

          {!loading && prayerTimes ? (
            <div className="p-3">
              <div className="flex justify-between mb-2 text-center">
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.lastThird}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.lastThird}</p>
                </div>
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.fajr}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.fajr}</p>
                </div>
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.sunrise}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.sunrise}</p>
                </div>
              </div>

              <div className="flex justify-between mb-2 text-center">
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.dhuhr}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.dhuhr}</p>
                </div>
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.asr}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.asr}</p>
                </div>
                <div className="flex-1 mx-0.5" />
              </div>

              <div className="flex justify-between text-center">
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.maghrib}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.maghrib}</p>
                </div>
                <div className="flex-1 bg-islamic-gold/10 rounded p-1 mx-0.5">
                  <p className="text-xs text-islamic-green font-bold">{prayerNames.isha}</p>
                  <p className="text-islamic-gold font-bold">{prayerTimes.isha}</p>
                </div>
                <div className="flex-1 mx-0.5" />
              </div>

              {isToday() && currentPrayerInfo && (
                <div className="mt-3 bg-islamic-gold/10 p-2 rounded text-center border border-islamic-gold/20">
                  <div className="text-sm">
                    {currentPrayerInfo.next && (
                      <p className="text-islamic-green">
                        <span className="font-bold">{currentPrayerInfo.next.label}</span>
                        : {currentPrayerInfo.next.time} | متبقي: {getTimeUntilNext(currentPrayerInfo.next.time)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <div className="p-3 text-center">
                <p className="text-islamic-green text-sm">لا توجد أوقات صلاة لهذا التاريخ</p>
              </div>
            )
          )}

          {!isToday() && !loading && (
            <div className="p-2">
              <button
                type="button"
                onClick={goToToday}
                className="w-full bg-islamic-gold/80 text-white py-2 rounded-lg hover:bg-islamic-gold transition-colors font-cairo text-sm flex items-center justify-center gap-2"
              >
                <i className="fas fa-calendar-day text-xs" />
                العودة إلى اليوم
              </button>
            </div>
          )}
        </div>

        {/* Preview + shared download button */}
        {!loading && prayerTimes && (
          <div className="mt-8 flex flex-col items-center gap-20">
            <div ref={previewRef}>
              <PrayerTimePreview
                date={formatDateDisplay(currentDate)}
                hijriDate={hijriDate || ""}
                prayerTimes={prayerTimes}
              />
            </div>

            

            {/* NEW: styled exactly like your existing green button */}
            <DownloadButton
              targetRef={previewRef}
              filename={dlName}
              scale={2}
              forceSize={1080}
            >
              تحميل الصورة
            </DownloadButton>
          </div>
        )}

      </div>
    </div>
  );
};

export default PrayerTimeViewer;
