import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url('/lovable-uploads/d3c1e98d-dd2f-4f08-b5bd-b8ef6b58c6e2.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
      <Navigation />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};