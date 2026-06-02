import Link from "next/link";
import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default  function RenderSidebarIcon({icon,href}:{icon:React.ReactNode,href:string}){

 return ( <Link href={href}>{icon}</Link>)



}