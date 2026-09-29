const nodemailer=require("nodemailer");
const clean=(v,max=4000)=>String(v??"").replace(/[<>]/g,"").trim().slice(0,max);
module.exports=async(req,res)=>{
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({ok:false,error:"Método no permitido"})}
 try{
  const b=req.body||{},nombre=clean(b.nombre,120),email=clean(b.email,180),telefono=clean(b.telefono,60),modelo=clean(b.modelo,160),averia=clean(b.averia,120),mensaje=clean(b.mensaje);
  if(!nombre||!email||!telefono||!mensaje)return res.status(400).json({ok:false,error:"Faltan campos obligatorios"});
  if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS)return res.status(500).json({ok:false,error:"Configuración SMTP incompleta"});
  const port=Number(process.env.SMTP_PORT||465);
  const tr=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:String(process.env.SMTP_SECURE??"true")==="true",auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
  await tr.sendMail({from:`"HpRepair" <${process.env.SMTP_USER}>`,to:process.env.CONTACT_EMAIL||process.env.SMTP_USER,replyTo:email,subject:"Nueva consulta HpRepair - equipo HP",text:`Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nModelo: ${modelo||"-"}\nAvería: ${averia||"-"}\n\nMensaje:\n${mensaje}`});
  return res.status(200).json({ok:true});
 }catch(e){console.error("HpRepair contacto:",e);return res.status(500).json({ok:false,error:"No se pudo enviar"})}
};