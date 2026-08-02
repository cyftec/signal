import { value } from "../../../utils";
import { DerivedSignal } from "../derived-signal";
import { MaybeSignal } from "../types";

type ResultProcessor = <X>(resultGetter: () => X) => DerivedSignal<X>;

export class ComparisonMethods<T, R> {
  constructor(
    protected inputGetter: () => T,
    protected comparisonResultProcessor: (
      comparisonResultGetter: () => boolean,
    ) => R,
  ) {}

  get truthy() {
    return this.comparisonResultProcessor(() => !!this.inputGetter());
  }

  get falsy() {
    return this.comparisonResultProcessor(() => !this.inputGetter());
  }

  equalTo(compareValue: MaybeSignal<T>) {
    return this.comparisonResultProcessor(
      () => this.inputGetter() === value(compareValue),
    );
  }

  notEqualTo(compareValue: MaybeSignal<T>) {
    this.comparisonResultProcessor(
      () => this.inputGetter() !== value(compareValue),
    );
  }

  greaterThan(compareValue: MaybeSignal<T>) {
    return this.comparisonResultProcessor(
      () => this.inputGetter() > value(compareValue),
    );
  }

  greaterThanOrEqualTo(compareValue: MaybeSignal<T>) {
    return this.comparisonResultProcessor(
      () => this.inputGetter() >= value(compareValue),
    );
  }

  smallerThan(compareValue: MaybeSignal<T>) {
    return this.comparisonResultProcessor(
      () => this.inputGetter() < value(compareValue),
    );
  }

  smallerThanOrEqualTo(compareValue: MaybeSignal<T>) {
    return this.comparisonResultProcessor(
      () => this.inputGetter() <= value(compareValue),
    );
  }
}

export class ThenMethods {
  constructor(
    protected truthyGetter: () => boolean,
    protected thenResultProcessor: ResultProcessor,
  ) {}

  then<U, V>(truthyOption: MaybeSignal<U>, falsyOption: MaybeSignal<V>) {
    return this.thenResultProcessor(() =>
      this.truthyGetter() ? value(truthyOption) : value(falsyOption),
    );
  }
}

export class SignalComarisonMethods<T> {
  constructor(
    protected inputGetter: () => T,
    protected resultProcessor: ResultProcessor,
  ) {}

  get is() {
    return new ComparisonMethods(this.inputGetter, this.resultProcessor);
  }

  get when() {
    const comparisonResultProcessor = (comparisonResultGetter: () => boolean) =>
      new ThenMethods(comparisonResultGetter, this.resultProcessor);

    return new ComparisonMethods(this.inputGetter, comparisonResultProcessor);
  }
}

const chk = new SignalComarisonMethods(
  () => [""],
  (resultGetter: () => any) => new DerivedSignal(resultGetter),
);

const res1 = chk.is.equalTo([""]);
const res2 = chk.when.equalTo([""]).then("", 1);
