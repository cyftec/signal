import { getPlainMethodParams } from "../../../utils";
import { DerivedSignal } from "../derived-signal";
import { MaybeSignalsArray, Signal } from "../types";

export class ArraySignalMethods<T extends unknown[]> {
  constructor(private _baseSignal: Signal<T[]>) {}

  protected _derive<R>(valueGetter: () => R): Signal<R> {
    return new DerivedSignal(valueGetter);
  }

  get length() {
    return this._derive(() => this._baseSignal.value.length);
  }

  at(...args: MaybeSignalsArray<Parameters<unknown[]["at"]>>) {
    return this._derive(() =>
      this._baseSignal.value.at(...getPlainMethodParams(...args)),
    );
  }

  concat(...args: MaybeSignalsArray<Parameters<unknown[]["concat"]>>) {
    return this._derive(() =>
      this._baseSignal.value.concat(
        ...(getPlainMethodParams(...args) as Parameters<T[]["concat"]>),
      ),
    );
  }

  every(...args: MaybeSignalsArray<Parameters<unknown[]["every"]>>) {
    return this._derive(() =>
      this._baseSignal.value.every(...getPlainMethodParams(...args)),
    );
  }

  filter(...args: MaybeSignalsArray<Parameters<unknown[]["filter"]>>) {
    return this._derive(() =>
      this._baseSignal.value.filter(...getPlainMethodParams(...args)),
    );
  }

  find(...args: MaybeSignalsArray<Parameters<unknown[]["find"]>>) {
    return this._derive(() =>
      this._baseSignal.value.find(...getPlainMethodParams(...args)),
    );
  }

  findIndex(...args: MaybeSignalsArray<Parameters<unknown[]["findIndex"]>>) {
    return this._derive(() =>
      this._baseSignal.value.findIndex(...getPlainMethodParams(...args)),
    );
  }

  findLast(...args: MaybeSignalsArray<Parameters<unknown[]["findLast"]>>) {
    return this._derive(() =>
      this._baseSignal.value.findLast(...getPlainMethodParams(...args)),
    );
  }

  findLastIndex(
    ...args: MaybeSignalsArray<Parameters<unknown[]["findLastIndex"]>>
  ) {
    return this._derive(() =>
      this._baseSignal.value.findLastIndex(...getPlainMethodParams(...args)),
    );
  }

  map(...args: MaybeSignalsArray<Parameters<unknown[]["map"]>>) {
    return this._derive(() =>
      this._baseSignal.value.map(...getPlainMethodParams(...args)),
    );
  }

  reduce(...args: MaybeSignalsArray<Parameters<unknown[]["reduce"]>>) {
    return this._derive(() =>
      this._baseSignal.value.reduce(...getPlainMethodParams(...args)),
    );
  }

  reduceRight(
    ...args: MaybeSignalsArray<Parameters<unknown[]["reduceRight"]>>
  ) {
    return this._derive(() =>
      this._baseSignal.value.reduceRight(...getPlainMethodParams(...args)),
    );
  }

  some(...args: MaybeSignalsArray<Parameters<unknown[]["some"]>>) {
    return this._derive(() =>
      this._baseSignal.value.some(...getPlainMethodParams(...args)),
    );
  }

  toReversed(...args: MaybeSignalsArray<Parameters<unknown[]["toReversed"]>>) {
    return this._derive(() =>
      this._baseSignal.value.toReversed(...getPlainMethodParams(...args)),
    );
  }

  toSorted(...args: MaybeSignalsArray<Parameters<unknown[]["toSorted"]>>) {
    return this._derive(() =>
      this._baseSignal.value.toSorted(...getPlainMethodParams(...args)),
    );
  }

  toSpliced(...args: MaybeSignalsArray<Parameters<unknown[]["toSpliced"]>>) {
    return this._derive(() =>
      this._baseSignal.value.toSpliced(...getPlainMethodParams(...args)),
    );
  }

  partition(...args: MaybeSignalsArray<Parameters<unknown[]["filter"]>>) {
    return [
      this._derive(() => this._baseSignal.value.filter(...args)),
      this._derive(() =>
        this._baseSignal.value.filter(
          (item: unknown, index: number, array: unknown[]) =>
            !args[0](item, index, array),
        ),
      ),
    ];
  }

  lastItem(): Signal<T | undefined> {
    return this._derive(() => this._baseSignal.value.at(-1));
  }
}
