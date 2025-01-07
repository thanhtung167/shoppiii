import {Link} from "react-router-dom";
import path from "../../constants/path.ts";

export default function NotFound() {
    return (
        <section className="bg-gray-100 ">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight text-orange/90 font-extrabold lg:text-9xl  ">404</h1>
                    <p className="mb-4 text-lg font-light text-slate-400 ">It looks like something is missing!
                    </p>
                    <Link to={path.home}
                       className="text-white py-2 px-4 bg-orange rounded-sm shadow-sm text-sm inline-block ">Trở về trang chủ</Link>
                </div>
            </div>
        </section>
    )
}