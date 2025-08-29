import React from "react";
import { downloadNodeAsPNG } from "../utils/downloadCard";

export default function DownloadButton({
    targetRef,
    filename = "card.png",
    scale = 2,
    forceSize = 1080,
    className = "",
    children = "تحميل الصورة",
}) {
    const [busy, setBusy] = React.useState(false);

    const onClick = async () => {
        if (!targetRef?.current) {
            alert("لم يتم العثور على البطاقة للتحميل");
            return;
        }
        setBusy(true);
        try {
            await downloadNodeAsPNG(targetRef.current, { filename, scale, forceSize });
        } catch (e) {
            console.error(e);
            alert("حدث خطأ أثناء تحميل الصورة");
        } finally {
            setBusy(false);
        }
    };

    return (
        <button type="button" onClick={onClick} disabled={busy} airia-busy={busy}
            className={`
              bg-islamic-green text-white px-8 py-4 rounded-xl
              font-cairo font-bold shadow-md
              hover:bg-islamic-green/90
              disabled:opacity-50 disabled:cursor-not-allowed
              min-w-[200px] ${className}
             `}>
            {busy ? "جاري التحميل..." : children}
        </button>
    );
}
