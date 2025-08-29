import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    // Add authentication logic here
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-islamic-pattern px-4 py-10 font-arabic-title"
    >
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border-r-4 border-islamic-gold">
        <h2 className="text-2xl font-bold text-center text-islamic-green mb-6">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-islamic-green mb-2">
              اسم المستخدم
            </label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-islamic-green"
              placeholder="ادخل اسم المستخدم"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-islamic-green mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-islamic-green"
              placeholder="ادخل كلمة المرور"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">هذا الحقل مطلوب</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-islamic-gold hover:bg-yellow-600 text-white font-semibold py-2 rounded transition-all duration-300 hover:scale-105"
          >
            دخول
          </button>
          <p className="text-sm text-center text-gray-600">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="text-islamic-green font-semibold hover:underline"
            >
              قم بإنشاء حساب جديد
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
