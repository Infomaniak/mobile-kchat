// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

class NavigationPropsStoreSingleton {
    private props = new Map<string, Record<string, unknown>>();
    private nextId = 0;

    clear = () => {
        this.props.clear();
        this.nextId = 0;
    };

    get = (id?: string) => {
        if (!id) {
            return {};
        }

        return this.props.get(id) || {};
    };

    remove = (id?: string) => {
        if (id) {
            this.props.delete(id);
        }
    };

    set = (props: Record<string, unknown> = {}) => {
        const id = `navigation-props-${this.nextId}`;
        this.nextId += 1;
        this.props.set(id, props);
        return id;
    };
}

const NavigationPropsStore = new NavigationPropsStoreSingleton();
export default NavigationPropsStore;
