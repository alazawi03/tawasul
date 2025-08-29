import React , {useState} from 'react';
// import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const hallSupervisors = [
  { id: 1, name: "صالة الحد الأهلية", area: "الحد", manager: "فاطمة المرباطي", phone: "33112945" },
  { id: 2, name: "صالة الحمد ", area: "الحد", manager: "عيسى", phone: "36997747" },
  { id: 3, name: "صالة الزامل", area: "الحد", manager: "خالد العمادي", phone: "39604481" },
  { id: 4, name: "صالة الحد الخيرية", area: "الحد", manager: "محمد زين", phone: "33779174" },
  { id: 5, name: "صالة حمد علي كانو", area: "الحد", manager: "عبدالناصر عبدالله", phone: "39653344" },
  { id: 6, name: "صالة يوسف احمد الملك", area: "قلالي", manager: "", phone: "34157070" },
  { id: 7, name: "صالة راشد الزياني", area: "قلالي", manager: "عمران", phone: "36435387" },
  { id: 8, name: "صالة جليجل", area: "قلالي", manager: "بو عاصم", phone: "36563335" },
  { id: 9, name: "قاعة الجمعية الإسلامية", area: "عراد", manager: "", phone: "17671788" },
  { id: 10, name: "صالة ليمو", area: "عراد", manager: "محمد الدوسري", phone: "39452227" },
  { id: 11, name: "صالة أحمد بن جمعان", area: "البسيتين", manager: "خالد الملكي", phone: "39333845" },
  { id: 12, name: "صالة محمد يوسف الحسن", area: "البسيتين", manager: "أنور بوكمال", phone: "38889660" },
  { id: 13, name: "صالة جمشير", area: "البسيتين", manager: "عبدالحميد أمين", phone: "39274925" },
  { id: 14, name: "صالة يوسف فخرو", area: "البسيتين", manager: "محمود يوسف", phone: "39672664" },
  { id: 15, name: "صالة يوسف ماجد", area: "المحرق", manager: "أحمد ماجد", phone: "39672664" },
  { id: 16, name: "صالة محمد عاشير", area: "البسيتين", manager: "أحمد عاشير", phone: "39279888" },
  { id: 17, name: "صالة المرباطي", area: "الحالة", manager: "عبالغفار المرباطي", phone: "36670500" },
  { id: 18, name: "مجلس يوسف بن الحسن العربي", area: "الحالة", manager: "يوسف", phone: "39631144" },
  { id: 19, name: "صالة بو ماهر", area: "الحالة", manager: "إبراهيم", phone: "33211168" },
  { id: 20, name: "صالة خليفة بن موسى", area: "الحالة", manager: "عبدالله القلاف", phone: "36466106" },
  { id: 21, name: "صالة جامع حمد بن علي كانو", area: "المحرق", manager: "الشيخ نزيه", phone: "339804646" },
  { id: 22, name: "صالة جامع الشيخ عيسى بن علي", area: "المحرق", manager: "يوسف الغاوي", phone: "396333822" },
  { id: 23, name: "صالة الشكر", area: "المحرق", manager: "جاسم الملا", phone: "333507000" },
  { id: 24, name: "صالة يوسف حسين", area: "المحرق", manager: "بو خالد", phone: "39271276" },
  { id: 25, name: "قاعة عبدالرحمن الجودر", area: "المحرق", manager: "جمعية الإصلاح - المحرق", phone: "17323990" },
  { id: 26, name: "صالة إبراهيم خليل كانو", area: "المنامة", manager: "نورة محمد", phone: "39306050" },
  { id: 27, name: "صالة كانو مقبرة المنامة", area: "المنامة", manager: "فاروق", phone: "39424121" },
  { id: 28, name: "صالة محمد عبد الله المناعي", area: "المنامة", manager: "جاسم الذوادي", phone: "39658565" },
  { id: 29, name: "صالة الملك خالد", area: "ام الحصم", manager: "خليل إبراهيم", phone: "39696313" },
  { id: 30, name: "صالة بن علي للنساء", area: "ام الحصم", manager: "الشيخ  زكي", phone: "39177055" },
  { id: 31, name: "صالة محفوظة سعيد الزياني", area: "الجنبية", manager: "نصيب خضر", phone: "34229241" },
  { id: 32, name: "صالة فاطمة كانو", area: "توبلي", manager: "أمنة الماجد", phone: "38889797" },
  { id: 33, name: "صالة فاطمة محمد جمعة", area: "سلماباد", manager: "خالد علي خلفان", phone: "36607773" },
  { id: 34, name: "صالة عبدالله محمد المعاودة", area: "عالي", manager: "أبو ياسر", phone: "39824718" },
  { id: 35, name: "صالة جامع سبيكة الانصاري", area: "مدينة عيسى", manager: "احمد", phone: "32156615" },
  { id: 36, name: "صالة عبدالله الكوهجي", area: "مدينة عيسى", manager: "عبدالعزيز حسين", phone: "38899950" },
  { id: 37, name: "صالة عائشة المؤيد", area: "مدينة عيسى", manager: "أبو محمد", phone: "39629066" },
  { id: 38, name: "صالة الزبيد بن العوام", area: "مدينة عيسى", manager: "عادل الشوملي", phone: "39325335" },
  { id: 39, name: "صالة شيخان الفارسي (البوكوارة)", area: "الرفاع", manager: "خالد الضويحي", phone: "32300996" },
  { id: 40, name: "صالة جامع شيخان الفارسي", area: "الرفاع", manager: "جاسم المحميد", phone: "32001137" },
  { id: 41, name: "صالة اهالي الرفاع", area: "الرفاع", manager: " يوسف", phone: "36118644" },
  { id: 42, name: "صالة عبدالله الغتم", area: "سفيان احمد", manager: "سيفين أحمد", phone: "34332003" },
  { id: 43, name: "صالة احمد و عائشة غاز", area: "مدينة حمد", manager: "بو علي", phone: "32234707" },
  { id: 44, name: "صالة صلاح الدين الايوبي", area: "الرفاع", manager: "خالد الضويحي", phone: "32300996" },
  { id: 45, name: "صالة النصف", area: "الرفاع", manager: "خالد الضويحي", phone: "32300996" },
  { id: 46, name: "صالة الشكر دوار 1", area: "مدينة حمد", manager: "عهود", phone: "34346657" },
  { id: 47, name: "صالة احمد علي كانو", area: "مدينة حمد", manager: "امينة ام محمد", phone: "38889797" },
  { id: 48, name: "صالة صهيب الرومي (دوار 22)", area: "مدينة حمد", manager: "الشيخ بو عبدالله", phone: "34526167" },
  { id: 49, name: "صالة فيصل بن حمد (دوار 19)", area: "مدينة حمد", manager: "", phone: "34524519" },
  { id: 50, name: "صالة عبد اللطيف كانو", area: "مدينة حمد", manager: "عمار الطيب", phone: "66939909" },
  { id: 51, name: "صالة أجور", area: "مدينة حمد", manager: "أبو أحمد", phone: "36328084" },
  { id: 52, name: "صالة احمد كانو", area: "مدينة حمد", manager: "أمينة الماجد", phone: "38889797" },
  { id: 53, name: "صالة لطيفة الجار", area: "مدينة حمد", manager: "غالب الجابري", phone: "38324632" }
];

const HallsSupervisors = () => {
  const [search, setSearch] = useState('');

  const filteredHalls = hallSupervisors.filter((hall) => {
    const query = search.toLowerCase();
    return (
      hall.name.toLowerCase().includes(query) ||
      hall.area.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8 text-right font-arabic-title min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-islamic-green flex items-center gap-2">
        {/* <FaMapMarkerAlt className="text-pink-600" /> */}
        أرقام مشرفي الصالات في مملكة البحرين
      </h1>

      {/* Centered search bar matching card width */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="🔍 ابحث باسم الصالة أو المنطقة..."
          className="border border-gray-300 rounded px-4 py-2 text-right shadow w-full md:w-[48%] lg:w-[31%]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-end">
        {filteredHalls.map((hall) => (
          <div
            key={hall.id}
            className="flex flex-col items-center justify-center text-center bg-white p-4 rounded shadow border-r-4 border-islamic-gold w-full md:w-[48%] lg:w-[31%]"
          >
            <p className="text-lg font-bold text-gray-800 mb-2">{hall.name}</p>

            <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
              {/* <FaMapMarkerAlt className="text-pink-600" /> */}
              <span>المنطقة: {hall.area}</span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              المسؤول: {hall.manager || '—'}
            </p>

            <a
              href={`tel:${hall.phone}`}
              className="text-islamic-gold font-bold hover:underline flex items-center gap-1"
            >
              {/* <FaPhoneAlt /> */}
              {hall.phone}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallsSupervisors;