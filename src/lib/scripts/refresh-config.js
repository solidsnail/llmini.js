import fs from "fs";
import path from "path";

const getModelName = (model) => model.id.split(`${model.author}/`)[1];
const refreshConfig = async (type) => {
  const response = await fetch(
    `https://huggingface.co/models-json?pipeline_tag=${type}&library=transformers.js&sort=downloads&withCount=true`
  );
  const payload = await response.json();
  const configUrl = path.resolve(`src/lib/categories/${type}/config.ts`);
  const oldConfigStr = fs.readFileSync(configUrl, "utf-8");
  const models = payload.models;

  const configStr = `${
    oldConfigStr.split("TypeModelName")[0]
  }TypeModelName = ${models
    .map((model) => `"${getModelName(model)}"`)
    .join(" | ")} | (string & {});

export const CONFIG: TypeConfig<TypeModelName, TypePretrained> = {
   ${models
     .map((model) => {
       return ` "${getModelName(model)}": {
    modelFileName: "model",
    dtype: "auto",
    name: "${model.id}",
    pretrained: "pipeline",
    subfolder: "onnx",
    device: "webgpu",
  }`;
     })
     .join(",\n")}
};`;
  fs.writeFileSync(configUrl, configStr);
};

const main = async () => {
  try {
    const [, , type = "object-detection"] = process.argv;
    await refreshConfig(type);
    console.log(`Config "${type}" refreshed successfully`);
  } catch (error) {
    console.log("Config refresh failed", error);
  }
};

main();
