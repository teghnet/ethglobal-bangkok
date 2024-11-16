import "./style.css";
import {setupRequestProveButton, setupVerifyButton, setupVProverButton,} from "./prove";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//     <button id="prove">Prove Ticket Ownership</button>
//     <button id="vprove" style="margin-top: 10px">Call vlayer prover</button>
//     <button id="vverify" style="margin-top: 10px">Call vlayer verifier</button>
// `;

setupRequestProveButton(document.querySelector<HTMLButtonElement>("#TLSNotaryProve")!);
setupVProverButton(document.querySelector<HTMLButtonElement>("#vLayerProve")!);
setupVerifyButton(document.querySelector<HTMLButtonElement>("#vLayerVerify")!);
