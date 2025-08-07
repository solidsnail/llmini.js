import { BaseStreamer } from "@huggingface/transformers";

type CallbackFunction = (chunk: {
  count: number;
  progress: number;
  time: number;
  total: number;
}) => void;
export class ProgressStreamer extends BaseStreamer {
  total: number;
  callback_function: CallbackFunction;
  count: number | null;
  start_time: DOMHighResTimeStamp | null;
  constructor(total: number, callback_function: CallbackFunction) {
    super();
    this.total = total;
    this.callback_function = callback_function;

    this.count = null;
    this.start_time = null;
  }

  put() {
    if (this.count === null) {
      // Ignore the first batch of tokens (prompt)
      this.count = 0;
      this.start_time = performance.now();
      return;
    }
    const progress = Number(((++this.count / this.total) * 100).toFixed(2));
    this.callback_function({
      count: this.count,
      total: this.total,
      progress,
      time: performance.now() - (this.start_time || 0),
    });
  }

  end() {
    /* no nothing */
  }
}
