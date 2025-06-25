"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHTML = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const styles_1 = require("./native/styles");
/**
 * Renders a specific {@code string} which may contain HTML.
 *
 * @param {string|undefined} html - The {@code string} which may
 * contain HTML to render.
 * @returns {ReactElement[]|string}
 */
function renderHTML(html) {
    if (typeof html === 'string') {
        // At the time of this writing, the specified HTML contains a couple
        // of spaces one after the other. They do not cause a visible
        // problem on Web, because the specified HTML is rendered as, well,
        // HTML. However, we're not rendering HTML here.
        // eslint-disable-next-line no-param-reassign
        html = html.replace(/\s{2,}/gi, ' ');
        // Render text in <b>text</b> in bold.
        const opening = /<\s*b\s*>/gi;
        const closing = /<\s*\/\s*b\s*>/gi;
        let o;
        let c;
        let prevClosingLastIndex = 0;
        const r = [];
        // eslint-disable-next-line no-cond-assign
        while (o = opening.exec(html)) {
            closing.lastIndex = opening.lastIndex;
            // eslint-disable-next-line no-cond-assign
            if (c = closing.exec(html)) {
                r.push(html.substring(prevClosingLastIndex, o.index));
                r.push(<react_native_1.Text style={styles_1.brandedDialog.boldDialogText}>
                        {html.substring(opening.lastIndex, c.index)}
                    </react_native_1.Text>);
                opening.lastIndex
                    = prevClosingLastIndex
                        = closing.lastIndex;
            }
            else {
                break;
            }
        }
        if (prevClosingLastIndex < html.length) {
            r.push(html.substring(prevClosingLastIndex));
        }
        return r;
    }
    return html;
}
exports.renderHTML = renderHTML;
