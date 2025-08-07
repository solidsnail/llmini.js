import { env } from "@huggingface/transformers";
env.backends.onnx.logLevel = "fatal";

console.log(env);
