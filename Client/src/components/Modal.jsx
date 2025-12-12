// import React from "react";
// import {
//   Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";
 
// export function Modal() {
//   const [open, setOpen] = React.useState(false);
 
//   const handleOpen = () => setOpen(!open);
 
//   return (
//     <>
//       <Button onClick={handleOpen} variant="gradient">
//         Open Modal
//       </Button>
//       <Dialog open={open} handler={handleOpen}>
//         <DialogHeader>Its a simple modal.</DialogHeader>
//         <DialogBody>
//           The key to more success is to have a lot of pillows. Put it this way,
//           it took me twenty five years to get these plants, twenty five years of
//           blood sweat and tears, and I&apos;m never giving up, I&apos;m just
//           getting started. I&apos;m up to something. Fan luv.
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="red"
//             onClick={handleOpen}
//             className="mr-1"
//           >
//             <span>Cancel</span>
//           </Button>
//           <Button variant="gradient" color="green" onClick={handleOpen}>
//             <span>Confirm</span>
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </>
//   );
// }

// import { Dialog } from "radix-ui";
// import { Cross2Icon } from "@radix-ui/react-icons";

// const Modal = () => (
// 	<Dialog.Root>
// 		<Dialog.Trigger asChild>
// 			<button className="inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-violet11 outline-none outline-offset-1 hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
// 				Edit profile
// 			</button>
// 		</Dialog.Trigger>
// 		<Dialog.Portal>
// 			<Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
// 			<Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
// 				<Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
// 					Edit profile
// 				</Dialog.Title>
// 				<Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
// 					Make changes to your profile here. Click save when you're done.
// 				</Dialog.Description>
// 				<fieldset className="mb-[15px] flex items-center gap-5">
// 					<label
// 						className="w-[90px] text-right text-[15px] text-violet11"
// 						htmlFor="name"
// 					>
// 						Name
// 					</label>
// 					<input
// 						className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
// 						id="name"
// 						defaultValue="Pedro Duarte"
// 					/>
// 				</fieldset>
// 				<fieldset className="mb-[15px] flex items-center gap-5">
// 					<label
// 						className="w-[90px] text-right text-[15px] text-violet11"
// 						htmlFor="username"
// 					>
// 						Username
// 					</label>
// 					<input
// 						className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
// 						id="username"
// 						defaultValue="@peduarte"
// 					/>
// 				</fieldset>
// 				<div className="mt-[25px] flex justify-end">
// 					<Dialog.Close asChild>
// 						<button className="inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none">
// 							Save changes
// 						</button>
// 					</Dialog.Close>
// 				</div>
// 				<Dialog.Close asChild>
// 					<button
// 						className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
// 						aria-label="Close"
// 					>
// 						<Cross2Icon />
// 					</button>
// 				</Dialog.Close>
// 			</Dialog.Content>
// 		</Dialog.Portal>
// 	</Dialog.Root>
// );

// export default Modal;

// Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
