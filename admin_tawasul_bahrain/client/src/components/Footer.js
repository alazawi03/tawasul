import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-islamic-green text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-4">
            <p className="text-islamic-gold text-lg font-arabic font-bold">
              اللهم اغفر لموتانا وموتى المسلمين
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-islamic-beige-light">
              جميع الحقوق محفوظة © {new Date().getFullYear()} - موقع تواصل أهل البحرين
            </p>
          </div>
          
          <div className="text-xs text-islamic-beige-light">
            <p>
              نسأل الله أن يتقبل من الأموات صالح أعمالهم ويتجاوز عن سيئاتهم
            </p>
          </div>
          {/*TODO: ADD  SOCIAL MEDIA*/}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
