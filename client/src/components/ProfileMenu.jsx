import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";

export default function ProfileMenu() {
	const menuRight = useRef(null);
	const toast = useRef(null);
	const items = [
		{
			label: "Options",
			items: [
				{
					label: "Refresh",
					icon: "pi pi-refresh",
				},
				{
					label: "Export",
					icon: "pi pi-upload",
				},
			],
		},
	];

	return (
		<div className="card flex justify-content-center">
			<Toast ref={toast}></Toast>

			<Menu
				model={items}
				popup
				ref={menuRight}
				id="popup_menu_right"
				popupAlignment="right"
			/>

			<Avatar
				label="Show Right"
				className="mr-2"
				aria-controls="popup_menu_right"
				aria-haspopup
				onClick={(event) => menuRight.current.toggle(event)}
				image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
				shape="circle"
				size="large"
			/>
		</div>
	);
}
