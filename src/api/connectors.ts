import {
  effect,
  type Signal,
  type SignalsEffect,
  type SourceSignal,
} from "../_core";

/**
 * When two or more signals are same, yet they exist independently, in
 * some cases you would want to connect them. So that, the change in one should
 * reflect in the other.
 *
 * This method is for receiving changes from multiple transmittor signals. Any change
 * in any of the transmittor signal will result in an update in the receiver
 * signal, where the current value of the receiver is the last updated transmittor
 * signal's value.
 * @param receiver a source-signal (which can be updated manually) of type T
 * which will recieve updates
 * @param transmittors multiple signals (source or derived) of the same type T as of the ```receiver```
 * @returns list of signal effects for disposing them when necessary
 *
 *
 * Example
 * ```
 * const sportsEvents = ["cricket @ 9am", "football @ 1pm", "kabaddi @ 6pm"];
 * const mediaEvents = ["movie afternoon @ 3pm", "concert @ 8pm"];
 *
 * const currentSportsEvent = signal("");
 * const currentMediaEvent = signal("");
 * const eventsNoticeBoardMessage = signal("");
 *
 * receive(eventsNoticeBoardMessage, sportsEvents, mediaEvents);
 * eventsNoticeBoardMessage.value = "No event hapening currently"
 * ```
 * Suppose if above current event signals are getting updated based on
 * the time of the day, let's say at 1pm ```currentSportsEvent``` signal gets
 * updated from "cricket @ 9am" to "football @ 1pm". Then ```eventsNoticeBoardMessage```
 * will show current sports event message. Then at 3pm, ```currentMediaEvent``` gets
 * updated as "movie afternoon @ 3pm", then ```eventsNoticeBoardMessage``` will update
 * from "football @ 1pm" to "movie afternoon @ 3pm";
 *
 * Notice that the receiver signal, can still be updated with any value independently.
 */
export const receive = <T>(
  receiver: SourceSignal<T>,
  ...transmittors: Signal<T>[]
): SignalsEffect[] => {
  const effects = transmittors.map((transmittor) =>
    effect(() => (receiver.value = transmittor.value))
  );
  return effects;
};

/**
 * When two or more signals are same, yet they exist independently, in
 * some cases you would want to connect them. So that, the change in one should
 * reflect in the other.
 *
 * This method is for broadcasting changes from one transmittor signal to multiple
 * receiver signals. Any change in the transmittor signal will result in an update
 * in all the receiver signals.
 * @param transmittor a source or derived signal of type T
 * @param receivers multiple signals (source or derived) of the same type T as of the ```receiver```
 * @returns a signal effect for disposing it when necessary
 *
 *
 * Example
 * ```
 * const satelliteBangaloreCurrentTemparature = signal("22C");
 *
 * const tvChannelBangaloreTempNews = signal("");
 * const radioChannelBangaloreTempNews = signal("");
 * const internetArticleBangaloreTempNews = signal("");
 *
 * transmit(
 *   satelliteBangaloreCurrentTemparature,
 *   tvChannelBangaloreTempNews,
 *   radioChannelBangaloreTempNews,
 *   internetArticleBangaloreTempNews,
 * );
 *
 * tvChannelBangaloreTempNews.value = "Samll interruption. See ads meanwhile."
 *
 *
 * ```
 * For above example, any change in the value of ```satelliteBangaloreCurrentTemparature```
 * will result in an update in all the receiver signals i.e. ```tvChannelBangaloreTempNews```,
 * ```radioChannelBangaloreTempNews``` and ```internetArticleBangaloreTempNews```.
 *
 * Notice that all the receiver signals, can still be updated with any value independently.
 */
export const transmit = <T>(
  transmittor: Signal<T>,
  ...receivers: SourceSignal<T>[]
): SignalsEffect =>
  effect(() => {
    receivers.forEach((receiver) => (receiver.value = transmittor.value));
  });
