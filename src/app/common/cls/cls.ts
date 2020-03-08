import * as cls from 'cls-hooked';

export class Cls {
    public readonly defaultKeyName: string;
    private readonly _defaultNamespaceKey: string;
    private _namespace: Cls;

    constructor() {
        this._defaultNamespaceKey = 'app';
        this._namespace = cls.getNamespace(this._defaultNamespaceKey) ||
            cls.createNamespace(this._defaultNamespaceKey);
    }
    public get(key: string): any {
        return this._namespace.get(key);
    }
    public set(key: string, value: any): void {
        this._namespace.set(key, value);
    }
    public run(callback: (...args: any[]) => any): void {
        this._namespace.run(callback);
    }
}
