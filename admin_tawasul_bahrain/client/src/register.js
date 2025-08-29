import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Registration Data:', data);
    // Add your registration logic here (e.g., API call or state update)
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-islamic-pattern px-4 py-10 font-arabic-title">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border-r-4 border-islamic-gold">
        <h2 className="text-2xl font-bold text-center text-islamic-green mb-6">إنشاء حساب جديد</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-islamic-green mb-2">اسم المستخدم</label>
            <input
              type="text"
              {...register('username', { required: true })}
              placeholder="ادخل اسم المستخدم"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-islamic-green"
            />
            {errors.username && <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-islamic-green mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="ادخل البريد الإلكتروني"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-islamic-green"
            />
            {errors.email && <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-islamic-green mb-2">كلمة المرور</label>
            <input
              type="password"
              {...register('password', { required: true })}
              placeholder="ادخل كلمة المرور"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-islamic-green"
            />
            {errors.password && <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-islamic-gold hover:bg-yellow-600 text-white font-semibold py-2 rounded transition-all duration-300 hover:scale-105"
          >
            إنشاء حساب
          </button>

          {/* Link to Login */}
          <p className="text-sm text-center mt-4">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-islamic-green font-bold hover:underline">
              سجّل الدخول من هنا
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
