import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import Link from "next/link";

const features = [
	{
		name: "Real-Time Vehicle Detection",
		description: "Track cars, trucks, bikes, and buses instantly across multiple video streams."
	},
	{
		name: "Traffic Congestion Alerts",
		description: "Get notifications and visualize congestion hotspots in real time."
	},
	{
		name: "Powerful Analytics Dashboard",
		description: "Explore historical traffic trends, export reports, and make data-driven decisions."
	},
	{
		name: "Easy API Integration",
		description: "Connect your cameras and systems in minutes with our REST API."
	}

]

export default function Home() {
	return (
		<div className="flex h-full bg-white dark:bg-zinc-900">
			<div className="flex w-full">
				<div className="fixed inset-0 flex justify-center sm:px-8">
					<div className="flex w-full max-w-7xl lg:px-8">
						<div className="w-full bg-white dark:bg-zinc-900"></div>
					</div>
				</div>

				<div className="relative flex w-full flex-col pb-20">

					<main className="flex-auto">
						<div className="sm:px-8 mt-12 sm:mt-24">
							<div className="mx-auto w-full max-w-7xl lg:px-8">
								<div className="relative px-4 sm:px-8 lg:px-12">
									<div className="mx-auto max-w-2xl lg:max-w-5xl">
										<header className="max-w-2xl mx-auto">
											<h1 className="text-3xl md:text-4xl mb-5 font-bold tracking-tight text-green-800 text-center lg:text-5xl mt-20">
												Real-Time Traffic Analytics. Smarter Decision
											</h1>

											<Alert variant={`destructive`}>
												<Terminal />
												<AlertTitle>Heads up</AlertTitle>
												<AlertDescription>This application is part of a personal portfolio to demonstrate real-time traffic analytics with AI. Use of the app is for demonstration only.</AlertDescription>
											</Alert>

											<div className="flex gap-2 justify-center mt-4">
												<Link href="/docs">
													<Button variant={`outline`} className={`px-3 py-6 font-semibold text-md`}>Documentation</Button>
												</Link>
												<Link href="/dashboard">
													<Button className={`px-3 py-6 font-semibold text-md bg-green-800 text-white`}>Get Started</Button>
												</Link>
											</div>
										</header>

										<h2 className="text-2xl md:text-3xl mb-5 font-bold tracking-tight text-center lg:text-5xl mt-20">
											How It Works
										</h2>

										<ul className="mt-4 relative border border-zinc-100 dark:border-zinc-700/40 rounded-lg py-2 px-8 overflow-hidden">
											<li className="list-disc mb-3">
												<span className="font-bold">Connect Your Streams –</span>
												Securely add RTSP/HLS video feeds or upload video files.
											</li>

											<li className="list-disc mb-2">
												<span className="font-bold">AI-Powered Detection –</span>
												YOLOv8 + DeepSORT analyzes each frame to detect and track vehicles.
											</li>

											<li className="list-disc">
												<span>Get Actionable Insights – </span>
												Access real-time metrics, historical trends, and automated alerts via dashboard or API.
											</li>
										</ul>


										<h2 className="text-2xl md:text-3xl mb-5 font-bold tracking-tight text-center lg:text-5xl mt-20">
											Features of the Application
										</h2>

										<div className="mt-4">
											<ul role="list" className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-2">
												{features.map((project, idx) => (
													<li key={project.id || idx} className="group relative flex flex-col items-start border border-zinc-100 dark:border-zinc-700/40 rounded-lg py-2 px-4 overflow-hidden">
														<div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
															<span
																className="h-11 w-11 flex items-center justify-center rounded-full bg-green-700 text-white text-2xl font-bold select-none"
																aria-label={project.name ? project.name[0].toUpperCase() : "P"}
															>
																{project.name ? project.name[0].toUpperCase() : "P"}
															</span>
														</div>
														<h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
															<span className="relative z-10">{project.name || "Project"}</span>
														</h2>

														<p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
															{project.description || "No description."}
														</p>

													</li>
												))}
											</ul>
										</div>


									</div>
								</div>
							</div>
						</div>
					</main>

				</div>
			</div>
		</div>
	);
}