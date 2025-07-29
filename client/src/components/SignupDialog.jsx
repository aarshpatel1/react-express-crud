import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

export default function SignupDialog() {
	const [visible, setVisible] = useState(false);

	return (
		<div className="card flex justify-content-center">
			<Button
				label="Signup"
				icon="pi pi-user"
				onClick={() => setVisible(true)}
			/>
			<Dialog
				className="border-round-3xl"
				visible={visible}
				modal
				onHide={() => {
					if (!visible) return;
					setVisible(false);
				}}
				content={({ hide }) => (
					<div
						className="flex flex-column px-6 py-3 gap-4 border-round-3xl border-round-lg shadow-8"
						style={{
							backdropFilter: "blur(20px)",
						}}
					>
						<h2 className="text-3xl mb-0 text-center">Signup</h2>
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="email"
								className="text-primary-50 font-semibold"
							>
								Email
							</label>
							<InputText
								id="email"
								label="Email"
								className="bg-white-alpha-20 border-none p-3 text-primary-50"
							></InputText>
						</div>
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="password"
								className="text-primary-50 font-semibold"
							>
								Password
							</label>
							<InputText
								id="password"
								label="Password"
								className="bg-white-alpha-20 border-none p-3 text-primary-50"
								type="password"
							></InputText>
						</div>
						<div className="inline-flex flex-column gap-2">
							<label
								htmlFor="confirmPassword"
								className="text-primary-50 font-semibold"
							>
								Confirm Password
							</label>
							<InputText
								id="confirmPassword"
								label="Confirm Password"
								className="bg-white-alpha-20 border-none p-3 text-primary-50"
								type="password"
							></InputText>
						</div>
						<div className="flex align-items-center gap-4 mb-4">
							<Button
								label="Sign-Up"
								onClick={(e) => hide(e)}
								text
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10 border-round-3xl"
							></Button>
							<Button
								label="Cancel"
								onClick={(e) => hide(e)}
								text
								className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10 border-round-3xl"
							></Button>
						</div>
					</div>
				)}
			></Dialog>
		</div>
	);
}
