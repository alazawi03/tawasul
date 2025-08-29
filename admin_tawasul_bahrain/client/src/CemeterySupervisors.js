import React, { useState } from 'react';

function CemeterySupervisors() {
  const [searchTerm, setSearchTerm] = useState('');

  const supervisors = [
    {
      name: "أنور بوكمال",
      phone: "33544551",
      noteLinks: [
        { label: "مقبرة المحرق", url: "https://maps.app.goo.gl/KAifJtrtMu7cFrsm6" },
        { label: "مقبرة الحالات", url: "https://maps.app.goo.gl/hjvaPr1XXjRakTk67" },
        { label: "مقبرة قلالي", url: "https://maps.app.goo.gl/fkTuRVwsS6CncoK89" },
      ],
    },
    {
      name: "عبد العزيز الكعبي",
      phone: "39338339",
      noteLinks: [
        { label: "مقبرة الحد", url: "https://maps.app.goo.gl/BmG2ZdQaBv1vFpdf7" },
      ],
    },
    {
      name: "حسن النصور",
      phone: "36008100",
      noteLinks: [
        { label: "مقبرة الحد", url: "https://maps.app.goo.gl/BmG2ZdQaBv1vFpdf7" },
      ],
    },
    {
      name: "فاروق العوضي",
      phone: "39424121",
      noteLinks: [
        { label: "مقبرة المنامة", url: "https://maps.app.goo.gl/oNMCgvJyiMqM2kGL6" },
      ],
    },
    {
      name: "جمال الجنيد",
      phone: "39414948",
      noteLinks: [
        { label: "مقبرة أم الحصم", url: "https://maps.app.goo.gl/rcZnRVqUsDie67rS6" },
      ],
    },
    {
      name: "عبد الله الغزيلي",
      phone: "39661216",
      noteLinks: [
        { label: "مقبرة البديع", url: "https://maps.app.goo.gl/3ZDNnV3ePGr6WmYu9" },
        { label: "مقبرة الجسرة", url: "https://maps.app.goo.gl/vaSWCTZQqE4Zn9J96" },
        { label: "مقبرة الزلاق", url: "https://maps.app.goo.gl/B4VaZDgqU7PpKmWFA" },
      ],
    },
    {
      name: "محمد السعيدي",
      phone: "39884368",
      noteLinks: [
        { label: "مقبرة الحنينية", url: "https://maps.app.goo.gl/1EHpXttnEPWascUy7" },
      ],
    },
  ];

  const filteredSupervisors = supervisors.filter((sup) =>
    sup.noteLinks.some((link) =>
      link.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-8 text-right font-arabic-title">
      <h1 className="text-3xl font-bold mb-6 text-islamic-green">
        📍 أرقام مشرفي المقابر في مملكة البحرين
      </h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 ابحث باسم المقبرة..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-end">
        {filteredSupervisors.map((sup, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center bg-white p-4 rounded shadow border-r-4 border-islamic-gold w-full md:w-[48%] lg:w-[31%]"
          >
            <p className="text-lg font-bold text-gray-800 mb-2">{sup.name}</p>

            <div className="text-sm text-gray-600 flex flex-col gap-1 mt-1 mb-2">
              {sup.noteLinks.map((note, idx) => (
                <a
                  key={idx}
                  href={note.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-blue-700"
                >
                  📍 {note.label}
                </a>
              ))}
            </div>

            <a
              href={`tel:${sup.phone}`}
              className="text-islamic-gold font-bold hover:underline"
            >
              📞 {sup.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CemeterySupervisors;
