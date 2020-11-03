import { Controller } from "stimulus";
import { createChannel } from "../utils/cable";
import { isPreview as isTurbolinksPreview } from '../utils/turbolinks';
import CableReady from 'cable_ready';

export default class extends Controller {
  static targets = ["lists", "form"];

  connect() {
    if (isTurbolinksPreview()) return;

    const channel = "WorkspaceChannel";
    const id = this.data.get("id");

    this.channel = createChannel(
      {channel, id},
      {
        received: (data) => {
          if (data.cableReady) CableReady.perform(data.operations);
        },
      }
    );
  }

  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
      delete this.channel;
    }
  }
}
