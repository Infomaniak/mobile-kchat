import { PureComponent, ReactNode } from 'react';
import { Animated } from 'react-native';
import { StyleType } from '../../../styles/functions.any';
/**
 * The type of the React {@code Component} props of {@link SlidingView}.
 */
export interface IProps {
    /**
     * The children of {@code SlidingView}.
     */
    children: ReactNode;
    /**
     * Callback to notify the containing {@code Component} that the view is
     * closing.
     */
    onHide: Function;
    /**
     * Position of the SlidingView: 'left', 'right', 'top', 'bottom'.
     * Later).
     */
    position: string;
    /**
     * Whether the {@code SlidingView} is to be displayed/rendered/shown or not.
     */
    show: boolean;
    /**
     * Style of the animated view.
     */
    style?: StyleType;
}
/**
 * The type of the React {@code Component} state of {@link SlidingView}.
 */
export interface IState {
    /**
     * Offset to move the view out of the screen.
     */
    positionOffset: number;
    /**
     * Whether the sliding overlay should be displayed/rendered/shown.
     */
    showOverlay: boolean;
    /**
     * The native animation object.
     */
    sliderAnimation: Animated.Value;
}
/**
 * A generic animated slider view to be used for animated menus.
 */
export default class SlidingView extends PureComponent<IProps, IState> {
    /**
     * True if the component is mounted.
     */
    _mounted: boolean;
    /**
     * Implements React's {@link Component#getDerivedStateFromProps()}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: IProps, prevState: IState): {
        showOverlay: boolean;
    };
    /**
     * Initializes a new {@code SlidingView} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps);
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#componentDidUpdate()}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Implements React's {@link Component#componentWillUnmount()}.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render(): JSX.Element | null;
    /**
     * Assembles a style array for the SlideView content.
     *
     * @private
     * @returns {Array<Object>}
     */
    _getContentStyle(): {
        position: string;
    } | {
        position: string;
    } | {
        position: string;
        length: number;
        toString(): string;
        toLocaleString(): string;
        pop(): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        } | undefined;
        push(...items: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]): number;
        concat(...items: ConcatArray<{
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>[]): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        concat(...items: ({
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        } | ConcatArray<{
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>)[]): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        join(separator?: string | undefined): string;
        reverse(): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        shift(): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        } | undefined;
        slice(start?: number | undefined, end?: number | undefined): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        sort(compareFn?: ((a: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, b: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }) => number) | undefined): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        splice(start: number, deleteCount?: number | undefined): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        splice(start: number, deleteCount: number, ...items: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        unshift(...items: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]): number;
        indexOf(searchElement: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, fromIndex?: number | undefined): number;
        lastIndexOf(searchElement: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, fromIndex?: number | undefined): number;
        every<S extends {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => U, thisArg?: any): U[];
        filter<S_1 extends {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => unknown, thisArg?: any): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        reduce(callbackfn: (previousValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        };
        reduce(callbackfn: (previousValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, initialValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        };
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        };
        reduceRight(callbackfn: (previousValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, initialValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        };
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, currentIndex: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, obj: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => value is S_2, thisArg?: any): S_2 | undefined;
        find(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, obj: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => unknown, thisArg?: any): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        } | undefined;
        findIndex(predicate: (value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, obj: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => unknown, thisArg?: any): number;
        fill(value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, start?: number | undefined, end?: number | undefined): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        copyWithin(target: number, start: number, end?: number | undefined): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[];
        entries(): IterableIterator<[number, {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<{
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>;
        includes(searchElement: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, fromIndex?: number | undefined): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }, index: number, array: {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }[]) => U_3 | readonly U_3[], thisArg?: This | undefined): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<{
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        }>;
        [Symbol.unscopables]: {
            [x: number]: boolean | undefined;
            length?: boolean | undefined;
            toString?: boolean | undefined;
            toLocaleString?: boolean | undefined;
            pop?: boolean | undefined;
            push?: boolean | undefined;
            concat?: boolean | undefined;
            join?: boolean | undefined;
            reverse?: boolean | undefined;
            shift?: boolean | undefined;
            slice?: boolean | undefined;
            sort?: boolean | undefined;
            splice?: boolean | undefined;
            unshift?: boolean | undefined;
            indexOf?: boolean | undefined;
            lastIndexOf?: boolean | undefined;
            every?: boolean | undefined;
            some?: boolean | undefined;
            forEach?: boolean | undefined;
            map?: boolean | undefined;
            filter?: boolean | undefined;
            reduce?: boolean | undefined;
            reduceRight?: boolean | undefined;
            find?: boolean | undefined;
            findIndex?: boolean | undefined;
            fill?: boolean | undefined;
            copyWithin?: boolean | undefined;
            entries?: boolean | undefined;
            keys?: boolean | undefined;
            values?: boolean | undefined;
            includes?: boolean | undefined;
            flatMap?: boolean | undefined;
            flat?: boolean | undefined;
            [Symbol.iterator]?: boolean | undefined;
            readonly [Symbol.unscopables]?: boolean | undefined;
            at?: boolean | undefined;
        };
        at(index: number): {
            [key: string]: string | number | {
                [key: string]: string | number;
            };
        } | undefined;
    };
    /**
     * Callback to handle the hardware back button.
     *
     * @returns {boolean}
     */
    _onHardwareBackPress(): boolean;
    /**
     * Hides the slider.
     *
     * @private
     * @returns {void}
     */
    _onHide(): void;
    /**
     * Shows/hides the slider menu.
     *
     * @param {boolean} show - If the slider view is to be made visible,
     * {@code true}; otherwise, {@code false}.
     * @private
     * @returns {Promise}
     */
    _setShow(show: boolean): Promise<void>;
}
