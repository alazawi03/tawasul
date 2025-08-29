import React from "react";

const IslamicQuotes = ({ selectedCategory = "death_announcement" }) => {
  // Get content based on selected category
  const getContent = () => {
    switch (selectedCategory) {
      case "blood_donation":
        return {
          verse: {
            text: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ ۖ وَإِن يَمْسَسْكَ بِخَيْرٍ فَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
            reference: "الأنعام: 17",
          },
          hadiths: [
            {
              text: "يا غُلامُ إنِّي أعلِّمُكَ كلِماتٍ ، احفَظِ اللَّهَ يحفَظكَ ، احفَظِ اللَّهَ تَجِدْهُ تجاهَكَ ، إذا سأَلتَ فاسألِ اللَّهَ ، وإذا استعَنتَ فاستَعِن باللَّهِ ، واعلَم أنَّ الأمَّةَ لو اجتَمعت علَى أن ينفَعوكَ بشَيءٍ لم يَنفعوكَ إلَّا بشيءٍ قد كتبَهُ اللَّهُ لَكَ ، ولو اجتَمَعوا على أن يضرُّوكَ بشَيءٍ لم يَضرُّوكَ إلَّا بشيءٍ قد كتبَهُ اللَّهُ عليكَ ، رُفِعَتِ الأقلامُ وجفَّتِ الصُّحفُ .",
              source: "رواه الترمذي وصححه",
            },
            {
              text: "ما يصيب المسلم من نصب ولا وصب ولا هم ولا حزن ولا أذى ولا غم، حتى الشوكة يشاكها إلا كفر الله بها من خطاياه.",
              source: "رواه البخاري ومسلم",
            },
          ],
          dua: "اللهم اشف مرضانا ومرضى المسلمين",
        };

      case "condolence_thanks":
        return {
          verse: {
            text: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ",
            reference: "الحجرات: 10",
          },
          hadiths: [
            {
              text: "لا يَشْكُرُ اللهَ مَن لا يَشْكُرُ الناسَ.",
              source: "رواه الترمذي وصححه",
            },
            {
              text: "بُعِثتُ لأُتَمِّمَ صالِحَ الأخْلاقِ.",
              source: "رواه أحمد والبيهقي",
            },
          ],
          dua: "اللهم اجعلنا من الشاكرين المقدرين",
        };

      case "prayer_request":
        return {
          verse: {
            text: "أَمَّن يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ وَيَجْعَلُكُمْ خُلَفَاءَ الْأَرْضِ ۗ أَإِلَٰهٌ مَّعَ اللَّهِ ۚ قَلِيلًا مَّا تَذَكَّرُونَ",
            reference: "النمل: 62",
          },
          hadiths: [
            {
              text: "عن عمرَ بنِ الخطاب قَالَ: اسْتَأْذَنْتُ النَّبِيَّ ﷺ في العُمْرَةِ، فَأَذِنَ لِي وَقالَ: لا تَنْسَنَا يَا أُخَيَّ مِنْ دُعَائِكَ، فَقَالَ كَلِمَةً مَا يَسُرُّني أَنَّ لِي بِهَا الدُّنْيَا.",
              source: "رواه أبو داود والترمذي",
            },
            {
              text: "اللهم رب الناس، أذهب البأس، اشفِ أنت الشافي، لا شفاء إلا شفاؤك، شفاءً لا يغادر سقمًا.",
              source: "رواه البخاري ومسلم",
            },
          ],
          dua: "اللهم أجب دعوة المضطرين وفرج كرب المكروبين",
        };

      case "death_announcement":
      default:
        return {
          verse: {
            text: "وَبَشِّرِ الصَّابِرِينَ * الَّذِينَ إِذَا أَصَابَتْهُمْ مُصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ * أُوْلَئِكَ عَلَيْهِمْ صَلَوَاتٌ مِنْ رَبِّهِمْ وَرَحْمَةٌ وَأُوْلَئِكَ هُمُ الْمُهْتَدُونَ",
            reference: "البقرة: 155-157",
          },
          hadiths: [
            {
              text: "مرَّ النبيُّ صَلَّى اللهُ عليه وسلَّمَ بامْرَأَةٍ تَبْكِي عِنْدَ قَبْرٍ، فَقالَ: اتَّقِي اللَّهَ واصْبِرِي، قالَتْ: إلَيْكَ عَنِّي، فإنَّكَ لَمْ تُصَبْ بمُصِيبَتِي، ولَمْ تَعْرِفْهُ، فقِيلَ لَهَا: إنَّه النبيُّ، فَقالَ: إنَّما الصَّبْرُ عِندَ الصَّدْمَةِ الأُولَى.",
              source: "رواه البخاري ومسلم",
            },
            {
              text: "إذا مات ولدٌ لعبدٍ، قال اللهُ عزَّ وجلَّ لملائكتِه: قبضتم ولدَ عبدي؟ فيقولون نعم، فيقولُ: ماذا قال عبدي؟ فيقولون: حمِدَك واسترجع، فيقولُ: ابنُوا لعبدي بيتًا في الجنَّةِ وسمُّوه بيتَ الحمدِ.",
              source: "رواه الترمذي وحسنه",
            },
          ],
          dua: "اللهم اغفر لموتانا وموتى المسلمين",
        };
    }
  };

  const content = getContent();

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-arabic-title text-islamic-green mb-7 islamic-text-shadow">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </h1>
        <p className="text-lg text-islamic-brown font-medium">
          تواصل أهل البحرين - نسأل الله أن يتغمد موتانا بالرحمة والمغفرة
        </p>
      </div>

      {/* Quran Verse */}
      <div className="quran-text mb-8">
        <p className="text-xl md:text-2xl leading-relaxed">
          <span className="text-islamic-gold">﴿</span> {content.verse.text}{" "}
          <span className="text-islamic-gold">﴾</span>
        </p>
        <p className="text-base text-islamic-gold font-bold mt-4 text-center">
          {content.verse.reference}
        </p>
      </div>

      {/* Hadiths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {content.hadiths.map((hadith, index) => (
          <div key={index} className="hadith-text">
            <p>{hadith.text}</p>
            <p className="text-xs text-islamic-gold mt-3 font-semibold">
              {hadith.source}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="inline-block bg-islamic-gold/10 rounded-full px-8 py-4 border-2 border-islamic-gold/30">
          <p className="text-islamic-green font-bold text-lg">{content.dua}</p>
        </div>
      </div>
    </div>
  );
};

export default IslamicQuotes;
