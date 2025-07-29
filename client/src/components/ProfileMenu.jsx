import { useRef } from "react";
// import { Toast } from "primereact/toast";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { Badge } from "primereact/badge";
// import { classNames } from "primereact/utils";

export default function ProfileMenu() {
	const menuRight = useRef(null);
	// const toast = useRef(null);

	const itemRenderer = (item) => (
		<div className="p-menuitem-content">
			<a className="flex align-items-center p-menuitem-link">
				<span className={item.icon} />
				<span className="mx-2">{item.label}</span>
				{item.badge && <Badge className="ml-auto" value={item.badge} />}
				{item.shortcut && (
					<span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
						{item.shortcut}
					</span>
				)}
			</a>
		</div>
	);

	let items = [
		{
			label: "Profile",
			items: [
				{
					label: "Settings",
					icon: "pi pi-cog",
					shortcut: "⌘+O",
					template: itemRenderer,  url: '/unstyled'
				},
				{
					label: "Messages",
					icon: "pi pi-inbox",
					badge: 2,
					template: itemRenderer,
				},
				{
					label: "Logout",
					icon: "pi pi-sign-out",
					shortcut: "⌘+Q",
					class: "text-danger",
					template: itemRenderer,
				},
			],
		},
		{
			separator: true,
		},
		{
			// command: () => {
			// 	toast.current.show({
			// 		severity: "info",
			// 		summary: "Info",
			// 		detail: "Item Selected",
			// 		life: 3000,
			// 	});
			// },
			template: (item, options) => {
				return (
					<button
						// className={classNames(
						// 	options.className,
						// 	"w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
						// )}
						className="w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
						disabled
					>
						<Avatar
							image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
							className="mr-2"
							shape="circle"
						/>
						<div className="flex flex-column align">
							<span className="font-bold">Amy Elsner</span>
							<span className="text-sm">Agent</span>
						</div>
					</button>
				);
			},
		},
	];

	return (
		<div className="card flex justify-content-center">
			{/* <Toast ref={toast}></Toast> */}

			<Menu
				model={items}
				className="w-full md:w-15rem"
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
