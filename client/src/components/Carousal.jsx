import { useState, useEffect } from "react";
import { Galleria } from "primereact/galleria";
import { PhotoService } from "../service/PhotoService";

export default function Carousal() {
	const [images, setImages] = useState(null);

	const responsiveOptions = [
		{
			breakpoint: "1024px",
			numVisible: 5,
		},
		{
			breakpoint: "960px",
			numVisible: 4,
		},
		{
			breakpoint: "768px",
			numVisible: 3,
		},
		{
			breakpoint: "560px",
			numVisible: 1,
		},
	];

	useEffect(() => {
		PhotoService.getImages().then((data) => setImages(data));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const itemTemplate = (item) => {
		return (
			<img
				src={item.itemImageSrc}
				alt={item.alt}
				style={{ width: "100%", display: "block" }}
			/>
		);
	};

	const thumbnailTemplate = (item) => {
		return (
			<img
				src={item.thumbnailImageSrc}
				alt={item.alt}
				style={{ display: "block" }}
			/>
		);
	};

	return (
		<div>
			<Galleria
				className="m-auto"
				value={images}
				responsiveOptions={responsiveOptions}
				numVisible={7}
				circular
				style={{ maxWidth: "800px" }}
				item={itemTemplate}
				thumbnail={thumbnailTemplate}
			/>
		</div>
	);
}
