import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal, CopyIcon } from "lucide-react"

export default function DocumentationPage() {
    return (
        <main className="flex-auto">
            <div className="sm:px-8 mt-12 sm:mt-24">
                <div className="mx-auto w-full max-w-7xl lg:px-8">
                    <div className="relative px-4 sm:px-8 lg:px-12">
                        <div className="mx-auto max-w-2xl lg:max-w-5xl">
                            <div className="max-w-2xl mx-auto">

                                <h1 className="text-3xl md:text-4xl mb-8 font-bold tracking-tight text-green-800 text-center mt-10">
                                    Real-Time Traffic Analytics. Smarter Decision
                                </h1>

                                <Alert variant={`destructive`}>
                                    <Terminal />
                                    <AlertTitle>Heads up</AlertTitle>
                                    <AlertDescription>This application is part of a personal portfolio to demonstrate real-time traffic analytics with AI. Use of the app is for demonstration only.</AlertDescription>
                                </Alert>

                                <p className="my-4">Welcome to the Smart Traffic Analyzer API. This is a portfolio project showcasing AI-powered traffic monitoring.</p>
                                <p className="mb-4">With this API, you can</p>

                                <ul className="pl-5 gap-y-3 mb-6">
                                    <li className="list-disc">Detect and count vehicles in video streams</li>
                                    <li className="list-disc">Track congestion in real time</li>
                                    <li className="list-disc">Set up alerts for traffic thresholds</li>
                                    <li className="list-disc">Access dashboards and analytics</li>
                                </ul>

                                <h2 className="text-2xl md:text-4xl mb-4 font-semibold tracking-tight mt-10">Get Started in 2 Steps</h2>
                                <ol className="pl-5 gap-y-3 mb-6">
                                    <li className="list-decimal font-bold">Get Your API key
                                        <div>Generate your API key using this code</div>
<pre className="bg-neutral-700 text-white p-4 rounded-lg overflow-x-auto shadow-md my-4 relative">
<CopyIcon className="absolute right-3 cursor-pointer" />
<code className="language-javascript">
{`curl -X  POST
https://smart-traffic-analyzer.emmanuelamoke.com/v1/auth
`}
</code>
</pre>
                                    </li>                                    



                                    <li className="list-decimal font-bold">Call Your First Endpoint</li>
                                    
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

//         <li className="font-bold">Get Your API Key
//     <ul className="list-disc pl-6 mt-2 text-base font-normal text-gray-700">
//       <li>Sign up or log in to your account.</li>
//       <li>Navigate to the API Keys section in your dashboard.</li>
//       <li>Click <span className="font-semibold text-green-700">Generate Key</span>.</li>
//     </ul>
//   </li>
//   <li className="font-bold">Generate your API key using this code
//     <div className="mt-2">
//       <pre className="bg-neutral-900 p-0 rounded-lg overflow-x-auto shadow-md">
//         <code className="language-javascript !whitespace-pre hljs">
// {`fetch('https://api.smarttrafficanalyzer.com/auth/key', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ email: 'your@email.com', password: 'yourPassword' })
// })
//   .then(res => res.json())
//   .then(data => console.log('Your API Key:', data.apiKey));`}
//         </code>
//       </pre>
//     </div>
//   </li>
//   <li className="font-bold">Call Your First Endpoint
//     <ul className="list-disc pl-6 mt-2 text-base font-normal text-gray-700">
//       <li>Use your API key in the <span className="font-mono bg-gray-100 px-1 rounded">Authorization</span> header.</li>
//       <li>Example endpoint: <span className="font-mono bg-gray-100 px-1 rounded">/api/traffic/stream</span></li>
//     </ul>
//   </li>

    )
} 