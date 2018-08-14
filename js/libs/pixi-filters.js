/*!
 * pixi-filters - v2.6.1
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters = (function (exports,pixi_js) {
'use strict';

/*!
 * @pixi/filter-adjustment - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-adjustment is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform float gamma;\r\nuniform float contrast;\r\nuniform float saturation;\r\nuniform float brightness;\r\nuniform float red;\r\nuniform float green;\r\nuniform float blue;\r\nuniform float alpha;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 c = texture2D(uSampler, vTextureCoord);\r\n\r\n    if (c.a > 0.0) {\r\n        c.rgb /= c.a;\r\n\r\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\r\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\r\n        rgb.r *= red;\r\n        rgb.g *= green;\r\n        rgb.b *= blue;\r\n        c.rgb = rgb * brightness;\r\n\r\n        c.rgb *= c.a;\r\n    }\r\n\r\n    gl_FragColor = c * alpha;\r\n}\r\n";

/**
 * The ability to adjust gamma, contrast, saturation, brightness, alpha or color-channel shift. This is a faster
 * and much simpler to use than {@link http://pixijs.download/release/docs/PIXI.filters.ColorMatrixFilter.html ColorMatrixFilter}
 * because it does not use a matrix.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/adjustment.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of the filter.
 * @param {number} [options.gamma=1] - The amount of luminance
 * @param {number} [options.saturation=1] - The amount of color saturation
 * @param {number} [options.contrast=1] - The amount of contrast
 * @param {number} [options.brightness=1] - The overall brightness
 * @param {number} [options.red=1] - The multipled red channel
 * @param {number} [options.green=1] - The multipled green channel
 * @param {number} [options.blue=1] - The multipled blue channel
 * @param {number} [options.alpha=1] - The overall alpha amount
 */
var AdjustmentFilter = (function (superclass) {
    function AdjustmentFilter(options) {
        superclass.call(this, vertex, fragment);

        Object.assign(this, {
            /**
             * The amount of luminance
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            gamma: 1,

            /**
             * The amount of saturation
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            saturation: 1,

            /**
             * The amount of contrast
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            contrast: 1,

            /**
             * The amount of brightness
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            brightness: 1,

            /**
             * The amount of red channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            red: 1,

            /**
             * The amount of green channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            green: 1,

            /**
             * The amount of blue channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            blue: 1,

            /**
             * The amount of alpha channel
             * @member {number}
             * @memberof PIXI.filters.AdjustmentFilter#
             * @default 1
             */
            alpha: 1,
        }, options);
    }

    if ( superclass ) { AdjustmentFilter.__proto__ = superclass; }
    AdjustmentFilter.prototype = Object.create( superclass && superclass.prototype );
    AdjustmentFilter.prototype.constructor = AdjustmentFilter;

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    AdjustmentFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.gamma = Math.max(this.gamma, 0.0001);
        this.uniforms.saturation = this.saturation;
        this.uniforms.contrast = this.contrast;
        this.uniforms.brightness = this.brightness;
        this.uniforms.red = this.red;
        this.uniforms.green = this.green;
        this.uniforms.blue = this.blue;
        this.uniforms.alpha = this.alpha;

        filterManager.applyFilter(this, input, output, clear);
    };

    return AdjustmentFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-kawase-blur - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-kawase-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$1 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$1 = "\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec2 uOffset;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = vec4(0.0);\r\n\r\n    // Sample top left pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\r\n\r\n    // Sample top right pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\r\n\r\n    // Sample bottom right pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\r\n\r\n    // Sample bottom left pixel\r\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\r\n\r\n    // Average\r\n    color *= 0.25;\r\n\r\n    gl_FragColor = color;\r\n}";

var fragmentClamp = "\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec2 uOffset;\r\nuniform vec4 filterClamp;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = vec4(0.0);\r\n\r\n    // Sample top left pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample top right pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample bottom right pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Sample bottom left pixel\r\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\r\n\r\n    // Average\r\n    color *= 0.25;\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

/**
 * A much faster blur than Gaussian blur, but more complicated to use.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/kawase-blur.png)
 *
 * @see https://software.intel.com/en-us/blogs/2014/07/15/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|number[]} [blur=4] - The blur of the filter. Should be greater than `0`. If
 *        value is an Array, setting kernels.
 * @param {number} [quality=3] - The quality of the filter. Should be an integer greater than `1`.
 * @param {boolean} [clamp=false] - Clamp edges, useful for removing dark edges
 *        from fullscreen filters or bleeding to the edge of filterArea.
 */
var KawaseBlurFilter = (function (superclass) {
    function KawaseBlurFilter(blur, quality, clamp) {
        if ( blur === void 0 ) { blur = 4; }
        if ( quality === void 0 ) { quality = 3; }
        if ( clamp === void 0 ) { clamp = false; }

        superclass.call(this, vertex$1, clamp ? fragmentClamp : fragment$1);
        this.uniforms.uOffset = new Float32Array(2);

        this._pixelSize = new pixi_js.Point();
        this.pixelSize = 1;
        this._clamp = clamp;
        this._kernels = null;

        // if `blur` is array , as kernels
        if (Array.isArray(blur)) {
            this.kernels = blur;
        }
        else {
            this._blur = blur;
            this.quality = quality;
        }
    }

    if ( superclass ) { KawaseBlurFilter.__proto__ = superclass; }
    KawaseBlurFilter.prototype = Object.create( superclass && superclass.prototype );
    KawaseBlurFilter.prototype.constructor = KawaseBlurFilter;

    var prototypeAccessors = { kernels: { configurable: true },clamp: { configurable: true },pixelSize: { configurable: true },quality: { configurable: true },blur: { configurable: true } };

    /**
     * Overrides apply
     * @private
     */
    KawaseBlurFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        var this$1 = this;

        var uvX = this.pixelSize.x / input.size.width;
        var uvY = this.pixelSize.y / input.size.height;
        var offset;

        if (this._quality === 1 || this._blur === 0) {
            offset = this._kernels[0] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, input, output, clear);
        }
        else {
            var renderTarget = filterManager.getRenderTarget(true);

            var source = input;
            var target = renderTarget;
            var tmp;

            var last = this._quality - 1;

            for (var i = 0; i < last; i++) {
                offset = this$1._kernels[i] + 0.5;
                this$1.uniforms.uOffset[0] = offset * uvX;
                this$1.uniforms.uOffset[1] = offset * uvY;
                filterManager.applyFilter(this$1, source, target, true);

                tmp = source;
                source = target;
                target = tmp;
            }
            offset = this._kernels[last] + 0.5;
            this.uniforms.uOffset[0] = offset * uvX;
            this.uniforms.uOffset[1] = offset * uvY;
            filterManager.applyFilter(this, source, output, clear);

            filterManager.returnRenderTarget(renderTarget);
        }
    };

    /**
     * Auto generate kernels by blur & quality
     * @private
     */
    KawaseBlurFilter.prototype._generateKernels = function _generateKernels () {
        var blur = this._blur;
        var quality = this._quality;
        var kernels = [ blur ];

        if (blur > 0) {
            var k = blur;
            var step = blur / quality;

            for (var i = 1; i < quality; i++) {
                k -= step;
                kernels.push(k);
            }
        }

        this._kernels = kernels;
    };

    /**
     * The kernel size of the blur filter, for advanced usage.
     *
     * @member {number[]}
     * @default [0]
     */
    prototypeAccessors.kernels.get = function () {
        return this._kernels;
    };
    prototypeAccessors.kernels.set = function (value) {
        if (Array.isArray(value) && value.length > 0) {
            this._kernels = value;
            this._quality = value.length;
            this._blur = Math.max.apply(Math, value);
        }
        else {
            // if value is invalid , set default value
            this._kernels = [0];
            this._quality = 1;
        }
    };

    /**
     * Get the if the filter is clampped.
     *
     * @readonly
     * @member {boolean}
     * @default false
     */
    prototypeAccessors.clamp.get = function () {
        return this._clamp;
    };

    /**
     * Sets the pixel size of the filter. Large size is blurrier. For advanced usage.
     *
     * @member {PIXI.Point|number[]}
     * @default [1, 1]
     */
    prototypeAccessors.pixelSize.set = function (value) {
        if (typeof value === 'number') {
            this._pixelSize.x = value;
            this._pixelSize.y = value;
        }
        else if (Array.isArray(value)) {
            this._pixelSize.x = value[0];
            this._pixelSize.y = value[1];
        }
        else if (value instanceof pixi_js.Point) {
            this._pixelSize.x = value.x;
            this._pixelSize.y = value.y;
        }
        else {
            // if value is invalid , set default value
            this._pixelSize.x = 1;
            this._pixelSize.y = 1;
        }
    };
    prototypeAccessors.pixelSize.get = function () {
        return this._pixelSize;
    };

    /**
     * The quality of the filter, integer greater than `1`.
     *
     * @member {number}
     * @default 3
     */
    prototypeAccessors.quality.get = function () {
        return this._quality;
    };
    prototypeAccessors.quality.set = function (value) {
        this._quality = Math.max(1, Math.round(value));
        this._generateKernels();
    };

    /**
     * The amount of blur, value greater than `0`.
     *
     * @member {number}
     * @default 4
     */
    prototypeAccessors.blur.get = function () {
        return this._blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this._blur = value;
        this._generateKernels();
    };

    Object.defineProperties( KawaseBlurFilter.prototype, prototypeAccessors );

    return KawaseBlurFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-advanced-bloom - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-advanced-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$2 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$2 = "\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform float threshold;\r\n\r\nvoid main() {\r\n    vec4 color = texture2D(uSampler, vTextureCoord);\r\n\r\n    // A simple & fast algorithm for getting brightness.\r\n    // It's inaccuracy , but good enought for this feature.\r\n    float _max = max(max(color.r, color.g), color.b);\r\n    float _min = min(min(color.r, color.g), color.b);\r\n    float brightness = (_max + _min) * 0.5;\r\n\r\n    if(brightness > threshold) {\r\n        gl_FragColor = color;\r\n    } else {\r\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\r\n    }\r\n}\r\n";

/**
 * Internal filter for AdvancedBloomFilter to get brightness.
 * @class
 * @private
 * @param {number} [threshold=0.5] Defines how bright a color needs to be extracted.
 */
var ExtractBrightnessFilter = (function (superclass) {
    function ExtractBrightnessFilter(threshold) {
        if ( threshold === void 0 ) { threshold = 0.5; }

        superclass.call(this, vertex$2, fragment$2);

        this.threshold = threshold;
    }

    if ( superclass ) { ExtractBrightnessFilter.__proto__ = superclass; }
    ExtractBrightnessFilter.prototype = Object.create( superclass && superclass.prototype );
    ExtractBrightnessFilter.prototype.constructor = ExtractBrightnessFilter;

    var prototypeAccessors = { threshold: { configurable: true } };

    /**
     * Defines how bright a color needs to be extracted.
     *
     * @member {number}
     * @default 0.5
     */
    prototypeAccessors.threshold.get = function () {
        return this.uniforms.threshold;
    };
    prototypeAccessors.threshold.set = function (value) {
        this.uniforms.threshold = value;
    };

    Object.defineProperties( ExtractBrightnessFilter.prototype, prototypeAccessors );

    return ExtractBrightnessFilter;
}(pixi_js.Filter));

var fragment$1$1 = "uniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D bloomTexture;\r\nuniform float bloomScale;\r\nuniform float brightness;\r\n\r\nvoid main() {\r\n    vec4 color = texture2D(uSampler, vTextureCoord);\r\n    color.rgb *= brightness;\r\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\r\n    bloomColor.rgb *= bloomScale;\r\n    gl_FragColor = color + bloomColor;\r\n}\r\n";

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/advanced-bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of advanced bloom filter.
 *                        When options is a number , it will be `options.threshold`.
 * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
 * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is more intense brightness.
 * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness, higher value is blown-out.
 * @param {number} [options.blur=8] - Sets the strength of the Blur properties simultaneously
 * @param {number} [options.quality=4] - The quality of the Blur filter.
 * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
 * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the Blur filter.
 */
var AdvancedBloomFilter = (function (superclass) {
    function AdvancedBloomFilter(options) {

        superclass.call(this, vertex$2, fragment$1$1);

        if (typeof options === 'number') {
            options = { threshold: options };
        }

        options = Object.assign({
            threshold: 0.5,
            bloomScale: 1.0,
            brightness: 1.0,
            kernels: null,
            blur: 8,
            quality: 4,
            pixelSize: 1,
            resolution: pixi_js.settings.RESOLUTION,
        }, options);

        /**
         * To adjust the strength of the bloom. Higher values is more intense brightness.
         *
         * @member {number}
         * @default 1.0
         */
        this.bloomScale = options.bloomScale;

        /**
         * The brightness, lower value is more subtle brightness, higher value is blown-out.
         *
         * @member {number}
         * @default 1.0
         */
        this.brightness = options.brightness;

        var kernels = options.kernels;
        var blur = options.blur;
        var quality = options.quality;
        var pixelSize = options.pixelSize;
        var resolution = options.resolution;

        this._extractFilter = new ExtractBrightnessFilter(options.threshold);
        this._extractFilter.resolution = resolution;
        this._blurFilter = kernels ?
            new KawaseBlurFilter(kernels) :
            new KawaseBlurFilter(blur, quality);
        this.pixelSize = pixelSize;
        this.resolution = resolution;
    }

    if ( superclass ) { AdvancedBloomFilter.__proto__ = superclass; }
    AdvancedBloomFilter.prototype = Object.create( superclass && superclass.prototype );
    AdvancedBloomFilter.prototype.constructor = AdvancedBloomFilter;

    var prototypeAccessors = { resolution: { configurable: true },threshold: { configurable: true },kernels: { configurable: true },blur: { configurable: true },quality: { configurable: true },pixelSize: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    AdvancedBloomFilter.prototype.apply = function apply (filterManager, input, output, clear, currentState) {

        var brightTarget = filterManager.getRenderTarget(true);

        this._extractFilter.apply(filterManager, input, brightTarget, true, currentState);

        var bloomTarget = filterManager.getRenderTarget(true);

        this._blurFilter.apply(filterManager, brightTarget, bloomTarget, true, currentState);

        this.uniforms.bloomScale = this.bloomScale;
        this.uniforms.brightness = this.brightness;
        this.uniforms.bloomTexture = bloomTarget;

        filterManager.applyFilter(this, input, output, clear);

        filterManager.returnRenderTarget(bloomTarget);
        filterManager.returnRenderTarget(brightTarget);
    };

    /**
     * The resolution of the filter.
     *
     * @member {number}
     */
    prototypeAccessors.resolution.get = function () {
        return this._resolution;
    };
    prototypeAccessors.resolution.set = function (value) {
        this._resolution = value;

        if (this._extractFilter) {
            this._extractFilter.resolution = value;
        }
        if (this._blurFilter) {
            this._blurFilter.resolution = value;
        }
    };

    /**
     * Defines how bright a color needs to be to affect bloom.
     *
     * @member {number}
     * @default 0.5
     */
    prototypeAccessors.threshold.get = function () {
        return this._extractFilter.threshold;
    };
    prototypeAccessors.threshold.set = function (value) {
        this._extractFilter.threshold = value;
    };

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    prototypeAccessors.kernels.get = function () {
        return this._blurFilter.kernels;
    };
    prototypeAccessors.kernels.set = function (value) {
        this._blurFilter.kernels = value;
    };

    /**
     * Sets the strength of the Blur properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blur.get = function () {
        return this._blurFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this._blurFilter.blur = value;
    };

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    prototypeAccessors.quality.get = function () {
        return this._blurFilter.quality;
    };
    prototypeAccessors.quality.set = function (value) {
        this._blurFilter.quality = value;
    };

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    prototypeAccessors.pixelSize.get = function () {
        return this._blurFilter.pixelSize;
    };
    prototypeAccessors.pixelSize.set = function (value) {
        this._blurFilter.pixelSize = value;
    };

    Object.defineProperties( AdvancedBloomFilter.prototype, prototypeAccessors );

    return AdvancedBloomFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-ascii - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-ascii is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$3 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$3 = "varying vec2 vTextureCoord;\r\n\r\nuniform vec4 filterArea;\r\nuniform float pixelSize;\r\nuniform sampler2D uSampler;\r\n\r\nvec2 mapCoord( vec2 coord )\r\n{\r\n    coord *= filterArea.xy;\r\n    coord += filterArea.zw;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 unmapCoord( vec2 coord )\r\n{\r\n    coord -= filterArea.zw;\r\n    coord /= filterArea.xy;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 pixelate(vec2 coord, vec2 size)\r\n{\r\n    return floor( coord / size ) * size;\r\n}\r\n\r\nvec2 getMod(vec2 coord, vec2 size)\r\n{\r\n    return mod( coord , size) / size;\r\n}\r\n\r\nfloat character(float n, vec2 p)\r\n{\r\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\r\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\r\n    {\r\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\r\n    }\r\n    return 0.0;\r\n}\r\n\r\nvoid main()\r\n{\r\n    vec2 coord = mapCoord(vTextureCoord);\r\n\r\n    // get the rounded color..\r\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\r\n    pixCoord = unmapCoord(pixCoord);\r\n\r\n    vec4 color = texture2D(uSampler, pixCoord);\r\n\r\n    // determine the character to use\r\n    float gray = (color.r + color.g + color.b) / 3.0;\r\n\r\n    float n =  65536.0;             // .\r\n    if (gray > 0.2) n = 65600.0;    // :\r\n    if (gray > 0.3) n = 332772.0;   // *\r\n    if (gray > 0.4) n = 15255086.0; // o\r\n    if (gray > 0.5) n = 23385164.0; // &\r\n    if (gray > 0.6) n = 15252014.0; // 8\r\n    if (gray > 0.7) n = 13199452.0; // @\r\n    if (gray > 0.8) n = 11512810.0; // #\r\n\r\n    // get the mod..\r\n    vec2 modd = getMod(coord, vec2(pixelSize));\r\n\r\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\r\n\r\n}";

// TODO (cengler) - The Y is flipped in this shader for some reason.

/**
 * @author Vico @vicocotea
 * original shader : https://www.shadertoy.com/view/lssGDj by @movAX13h
 */

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [size=8] Size of the font
 */
var AsciiFilter = (function (superclass) {
    function AsciiFilter(size) {
        if ( size === void 0 ) { size = 8; }

        superclass.call(this, vertex$3, fragment$3);
        this.size = size;
    }

    if ( superclass ) { AsciiFilter.__proto__ = superclass; }
    AsciiFilter.prototype = Object.create( superclass && superclass.prototype );
    AsciiFilter.prototype.constructor = AsciiFilter;

    var prototypeAccessors = { size: { configurable: true } };

    /**
     * The pixel size used by the filter.
     *
     * @member {number}
     */
    prototypeAccessors.size.get = function () {
        return this.uniforms.pixelSize;
    };
    prototypeAccessors.size.set = function (value) {
        this.uniforms.pixelSize = value;
    };

    Object.defineProperties( AsciiFilter.prototype, prototypeAccessors );

    return AsciiFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-bevel - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-bevel is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$4 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$4 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\n\r\nuniform float transformX;\r\nuniform float transformY;\r\nuniform vec3 lightColor;\r\nuniform float lightAlpha;\r\nuniform vec3 shadowColor;\r\nuniform float shadowAlpha;\r\n\r\nvoid main(void) {\r\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\r\n    vec4 color = texture2D(uSampler, vTextureCoord);\r\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\r\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\r\n\r\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\r\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\r\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\r\n}\r\n";

/**
 * Bevel Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bevel.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] - The optional parameters of the filter.
 * @param {number} [options.rotation = 45] - The angle of the light in degrees.
 * @param {number} [options.thickness = 2] - The tickness of the bevel.
 * @param {number} [options.lightColor = 0xffffff] - Color of the light.
 * @param {number} [options.lightAlpha = 0.7] - Alpha of the light.
 * @param {number} [options.shadowColor = 0x000000] - Color of the shadow.
 * @param {number} [options.shadowAlpha = 0.7] - Alpha of the shadow.
 */
var BevelFilter = (function (superclass) {
    function BevelFilter(options) {
        if ( options === void 0 ) { options = {}; }

        superclass.call(this, vertex$4, fragment$4);

        this.uniforms.lightColor = new Float32Array(3);
        this.uniforms.shadowColor = new Float32Array(3);

        options = Object.assign({
            rotation: 45,
            thickness: 2,
            lightColor: 0xffffff,
            lightAlpha: 0.7,
            shadowColor: 0x000000,
            shadowAlpha: 0.7,
        }, options);

        /**
         * The angle of the light in degrees.
         * @member {number}
         * @default 45
         */
        this.rotation = options.rotation;

        /**
         * The tickness of the bevel.
         * @member {number}
         * @default 2
         */
        this.thickness = options.thickness;

        /**
         * Color of the light.
         * @member {number}
         * @default 0xffffff
         */
        this.lightColor = options.lightColor;

        /**
         * Alpha of the light.
         * @member {number}
         * @default 0.7
         */
        this.lightAlpha = options.lightAlpha;

        /**
         * Color of the shadow.
         * @member {number}
         * @default 0x000000
         */
        this.shadowColor = options.shadowColor;

        /**
         * Alpha of the shadow.
         * @member {number}
         * @default 0.7
         */
        this.shadowAlpha = options.shadowAlpha;

    }

    if ( superclass ) { BevelFilter.__proto__ = superclass; }
    BevelFilter.prototype = Object.create( superclass && superclass.prototype );
    BevelFilter.prototype.constructor = BevelFilter;

    var prototypeAccessors = { rotation: { configurable: true },thickness: { configurable: true },lightColor: { configurable: true },lightAlpha: { configurable: true },shadowColor: { configurable: true },shadowAlpha: { configurable: true } };

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    BevelFilter.prototype._updateTransform = function _updateTransform () {
        this.uniforms.transformX = this._thickness * Math.cos(this._angle);
        this.uniforms.transformY = this._thickness * Math.sin(this._angle);
    };

    prototypeAccessors.rotation.get = function () {
        return this._angle / pixi_js.DEG_TO_RAD;
    };
    prototypeAccessors.rotation.set = function (value) {
        this._angle = value * pixi_js.DEG_TO_RAD;
        this._updateTransform();
    };

    prototypeAccessors.thickness.get = function () {
        return this._thickness;
    };
    prototypeAccessors.thickness.set = function (value) {
        this._thickness = value;
        this._updateTransform();
    };

    prototypeAccessors.lightColor.get = function () {
        return pixi_js.utils.rgb2hex(this.uniforms.lightColor);
    };
    prototypeAccessors.lightColor.set = function (value) {
        pixi_js.utils.hex2rgb(value, this.uniforms.lightColor);
    };

    prototypeAccessors.lightAlpha.get = function () {
        return this.uniforms.lightAlpha;
    };
    prototypeAccessors.lightAlpha.set = function (value) {
        this.uniforms.lightAlpha = value;
    };

    prototypeAccessors.shadowColor.get = function () {
        return pixi_js.utils.rgb2hex(this.uniforms.shadowColor);
    };
    prototypeAccessors.shadowColor.set = function (value) {
        pixi_js.utils.hex2rgb(value, this.uniforms.shadowColor);
    };

    prototypeAccessors.shadowAlpha.get = function () {
        return this.uniforms.shadowAlpha;
    };
    prototypeAccessors.shadowAlpha.set = function (value) {
        this.uniforms.shadowAlpha = value;
    };

    Object.defineProperties( BevelFilter.prototype, prototypeAccessors );

    return BevelFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-bloom - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-bloom is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var ref = pixi_js.filters;
var BlurXFilter = ref.BlurXFilter;
var BlurYFilter = ref.BlurYFilter;
var AlphaFilter = ref.AlphaFilter;

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|PIXI.Point|number[]} [blur=2] Sets the strength of both the blurX and blurY properties simultaneously
 * @param {number} [quality=4] The quality of the blurX & blurY filter.
 * @param {number} [resolution=PIXI.settings.RESOLUTION] The resolution of the blurX & blurY filter.
 * @param {number} [kernelSize=5] The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
 */
var BloomFilter = (function (superclass) {
    function BloomFilter(blur, quality, resolution, kernelSize) {
        if ( blur === void 0 ) { blur = 2; }
        if ( quality === void 0 ) { quality = 4; }
        if ( resolution === void 0 ) { resolution = pixi_js.settings.RESOLUTION; }
        if ( kernelSize === void 0 ) { kernelSize = 5; }

        superclass.call(this);

        var blurX;
        var blurY;

        if (typeof blur === 'number') {
            blurX = blur;
            blurY = blur;
        }
        else if (blur instanceof pixi_js.Point) {
            blurX = blur.x;
            blurY = blur.y;
        }
        else if (Array.isArray(blur)) {
            blurX = blur[0];
            blurY = blur[1];
        }

        this.blurXFilter = new BlurXFilter(blurX, quality, resolution, kernelSize);
        this.blurYFilter = new BlurYFilter(blurY, quality, resolution, kernelSize);
        this.blurYFilter.blendMode = pixi_js.BLEND_MODES.SCREEN;
        this.defaultFilter = new AlphaFilter();
    }

    if ( superclass ) { BloomFilter.__proto__ = superclass; }
    BloomFilter.prototype = Object.create( superclass && superclass.prototype );
    BloomFilter.prototype.constructor = BloomFilter;

    var prototypeAccessors = { blur: { configurable: true },blurX: { configurable: true },blurY: { configurable: true } };

    BloomFilter.prototype.apply = function apply (filterManager, input, output) {
        var renderTarget = filterManager.getRenderTarget(true);

        //TODO - copyTexSubImage2D could be used here?
        this.defaultFilter.apply(filterManager, input, output);

        this.blurXFilter.apply(filterManager, input, renderTarget);
        this.blurYFilter.apply(filterManager, renderTarget, output);

        filterManager.returnRenderTarget(renderTarget);
    };

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blur.get = function () {
        return this.blurXFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.blurXFilter.blur = this.blurYFilter.blur = value;
    };

    /**
     * Sets the strength of the blurX property
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blurX.get = function () {
        return this.blurXFilter.blur;
    };
    prototypeAccessors.blurX.set = function (value) {
        this.blurXFilter.blur = value;
    };

    /**
     * Sets the strength of the blurY property
     *
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blurY.get = function () {
        return this.blurYFilter.blur;
    };
    prototypeAccessors.blurY.set = function (value) {
        this.blurYFilter.blur = value;
    };

    Object.defineProperties( BloomFilter.prototype, prototypeAccessors );

    return BloomFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-bulge-pinch - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-bulge-pinch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$5 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$5 = "uniform float radius;\r\nuniform float strength;\r\nuniform vec2 center;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\n\r\nvoid main()\r\n{\r\n    vec2 coord = vTextureCoord * filterArea.xy;\r\n    coord -= center * dimensions.xy;\r\n    float distance = length(coord);\r\n    if (distance < radius) {\r\n        float percent = distance / radius;\r\n        if (strength > 0.0) {\r\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\r\n        } else {\r\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\r\n        }\r\n    }\r\n    coord += center * dimensions.xy;\r\n    coord /= filterArea.xy;\r\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\r\n    vec4 color = texture2D(uSampler, clampedCoord);\r\n    if (coord != clampedCoord) {\r\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\r\n    }\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

/**
 * @author Julien CLEREL @JuloxRox
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * Bulges or pinches the image in a circle.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bulge-pinch.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>} [center=[0,0]] The x and y coordinates of the center of the circle of effect.
 * @param {number} [radius=100] The radius of the circle of effect.
 * @param {number} [strength=1] -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
var BulgePinchFilter = (function (superclass) {
    function BulgePinchFilter(center, radius, strength) {
        superclass.call(this, vertex$5, fragment$5);
        this.uniforms.dimensions = new Float32Array(2);
        this.center = center || [0.5, 0.5];
        this.radius = radius || 100;
        this.strength = strength || 1;
    }

    if ( superclass ) { BulgePinchFilter.__proto__ = superclass; }
    BulgePinchFilter.prototype = Object.create( superclass && superclass.prototype );
    BulgePinchFilter.prototype.constructor = BulgePinchFilter;

    var prototypeAccessors = { radius: { configurable: true },strength: { configurable: true },center: { configurable: true } };

    BulgePinchFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;
        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * The radius of the circle of effect.
     *
     * @member {number}
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.radius;
    };
    prototypeAccessors.radius.set = function (value) {
        this.uniforms.radius = value;
    };

    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     *
     * @member {number}
     */
    prototypeAccessors.strength.get = function () {
        return this.uniforms.strength;
    };
    prototypeAccessors.strength.set = function (value) {
        this.uniforms.strength = value;
    };

    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.center;
    };
    prototypeAccessors.center.set = function (value) {
        this.uniforms.center = value;
    };

    Object.defineProperties( BulgePinchFilter.prototype, prototypeAccessors );

    return BulgePinchFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-color-map - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-color-map is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$6 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$6 = "\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform sampler2D colorMap;\r\n\r\nuniform float _mix;\r\nuniform float _size;\r\nuniform float _sliceSize;\r\nuniform float _slicePixelSize;\r\nuniform float _sliceInnerSize;\r\n\r\nvoid main() {\r\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\r\n\r\n    float sliceIndex = color.b * (_size - 1.0);\r\n    float zSlice0 = floor(sliceIndex);\r\n    float zSlice1 = ceil(sliceIndex);\r\n\r\n    float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\r\n    float s0 = xOffset + zSlice0 * _sliceSize;\r\n    float s1 = xOffset + zSlice1 * _sliceSize;\r\n    vec4 slice0Color = texture2D(colorMap, vec2(s0, color.g));\r\n    vec4 slice1Color = texture2D(colorMap, vec2(s1, color.g));\r\n    vec4 adjusted = mix(slice0Color, slice1Color, fract(sliceIndex));\r\n\r\n    gl_FragColor = mix(color, adjusted, _mix);\r\n}\r\n";

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-map.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The colorMap texture of the filter.
 * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
 * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
 */
var ColorMapFilter = (function (superclass) {
    function ColorMapFilter(colorMap, nearest, mix) {
        if ( nearest === void 0 ) { nearest = false; }
        if ( mix === void 0 ) { mix = 1; }

        superclass.call(this, vertex$6, fragment$6);

        this._size = 0;
        this._sliceSize = 0;
        this._slicePixelSize = 0;
        this._sliceInnerSize = 0;

        this._scaleMode = null;
        this._nearest = false;
        this.nearest = nearest;

        /**
         * The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
         * @member {number}
         */
        this.mix = mix;

        this.colorMap = colorMap;
    }

    if ( superclass ) { ColorMapFilter.__proto__ = superclass; }
    ColorMapFilter.prototype = Object.create( superclass && superclass.prototype );
    ColorMapFilter.prototype.constructor = ColorMapFilter;

    var prototypeAccessors = { colorSize: { configurable: true },colorMap: { configurable: true },nearest: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    ColorMapFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms._mix = this.mix;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * the size of one color slice
     * @member {number}
     * @readonly
     */
    prototypeAccessors.colorSize.get = function () {
        return this._size;
    };

    /**
     * the colorMap texture
     * @member {PIXI.Texture}
     */
    prototypeAccessors.colorMap.get = function () {
        return this._colorMap;
    };
    prototypeAccessors.colorMap.set = function (colorMap) {
        if (!(colorMap instanceof pixi_js.Texture)) {
            colorMap = pixi_js.Texture.from(colorMap);
        }
        if (colorMap && colorMap.baseTexture) {
            colorMap.baseTexture.scaleMode = this._scaleMode;
            colorMap.baseTexture.mipmap = false;

            this._size = colorMap.height;
            this._sliceSize = 1 / this._size;
            this._slicePixelSize = this._sliceSize / this._size;
            this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

            this.uniforms._size = this._size;
            this.uniforms._sliceSize = this._sliceSize;
            this.uniforms._slicePixelSize = this._slicePixelSize;
            this.uniforms._sliceInnerSize = this._sliceInnerSize;

            this.uniforms.colorMap = colorMap;
        }

        this._colorMap = colorMap;
    };

    /**
     * Whether use NEAREST for colorMap texture.
     * @member {boolean}
     */
    prototypeAccessors.nearest.get = function () {
        return this._nearest;
    };
    prototypeAccessors.nearest.set = function (nearest) {
        this._nearest = nearest;
        this._scaleMode = nearest ? pixi_js.SCALE_MODES.NEAREST : pixi_js.SCALE_MODES.LINEAR;

        var texture = this._colorMap;

        if (texture && texture.baseTexture) {
            texture.baseTexture._glTextures = {};

            texture.baseTexture.scaleMode = this._scaleMode;
            texture.baseTexture.mipmap = false;

            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);
        }
    };

    /**
     * If the colorMap is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    ColorMapFilter.prototype.updateColorMap = function updateColorMap () {
        var texture = this._colorMap;

        if (texture && texture.baseTexture) {
            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);

            this.colorMap = texture;
        }
    };

    /**
     * Destroys this filter
     *
     * @param {boolean} [destroyBase=false] Whether to destroy the base texture of colorMap as well
     */
    ColorMapFilter.prototype.destroy = function destroy (destroyBase) {
        if (this._colorMap) {
            this._colorMap.destroy(destroyBase);
        }
        superclass.prototype.destroy.call(this);
    };

    Object.defineProperties( ColorMapFilter.prototype, prototypeAccessors );

    return ColorMapFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-color-replace - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$7 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$7 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec3 originalColor;\r\nuniform vec3 newColor;\r\nuniform float epsilon;\r\nvoid main(void) {\r\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\r\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\r\n    float colorDistance = length(colorDiff);\r\n    float doReplace = step(colorDistance, epsilon);\r\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\r\n}\r\n";

/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/color-replace.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number|Array<number>} [originalColor=0xFF0000] The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
 * @param {number|Array<number>} [newColor=0x000000] The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
 * @param {number} [epsilon=0.4] Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.filters = [new ColorReplaceFilter(
 *   [1, 0, 0],
 *   [0, 0, 1],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(
 *   [220/255.0, 220/255.0, 220/255.0],
 *   [225/255.0, 200/255.0, 215/255.0],
 *   0.001
 *   )];
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.filters = [new ColorReplaceFilter(0xdcdcdc, 0xe1c8d7, 0.001)];
 *
 */
var ColorReplaceFilter = (function (superclass) {
    function ColorReplaceFilter(originalColor, newColor, epsilon) {
        if ( originalColor === void 0 ) { originalColor = 0xFF0000; }
        if ( newColor === void 0 ) { newColor = 0x000000; }
        if ( epsilon === void 0 ) { epsilon = 0.4; }

        superclass.call(this, vertex$7, fragment$7);
        this.uniforms.originalColor = new Float32Array(3);
        this.uniforms.newColor = new Float32Array(3);
        this.originalColor = originalColor;
        this.newColor = newColor;
        this.epsilon = epsilon;
    }

    if ( superclass ) { ColorReplaceFilter.__proto__ = superclass; }
    ColorReplaceFilter.prototype = Object.create( superclass && superclass.prototype );
    ColorReplaceFilter.prototype.constructor = ColorReplaceFilter;

    var prototypeAccessors = { originalColor: { configurable: true },newColor: { configurable: true },epsilon: { configurable: true } };

    /**
     * The color that will be changed, as a 3 component RGB e.g. [1.0, 1.0, 1.0]
     * @member {number|Array<number>}
     * @default 0xFF0000
     */
    prototypeAccessors.originalColor.set = function (value) {
        var arr = this.uniforms.originalColor;
        if (typeof value === 'number') {
            pixi_js.utils.hex2rgb(value, arr);
            this._originalColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._originalColor = pixi_js.utils.rgb2hex(arr);
        }
    };
    prototypeAccessors.originalColor.get = function () {
        return this._originalColor;
    };

    /**
     * The resulting color, as a 3 component RGB e.g. [1.0, 0.5, 1.0]
     * @member {number|Array<number>}
     * @default 0x000000
     */
    prototypeAccessors.newColor.set = function (value) {
        var arr = this.uniforms.newColor;
        if (typeof value === 'number') {
            pixi_js.utils.hex2rgb(value, arr);
            this._newColor = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            this._newColor = pixi_js.utils.rgb2hex(arr);
        }
    };
    prototypeAccessors.newColor.get = function () {
        return this._newColor;
    };

    /**
     * Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     * @member {number}
     * @default 0.4
     */
    prototypeAccessors.epsilon.set = function (value) {
        this.uniforms.epsilon = value;
    };
    prototypeAccessors.epsilon.get = function () {
        return this.uniforms.epsilon;
    };

    Object.defineProperties( ColorReplaceFilter.prototype, prototypeAccessors );

    return ColorReplaceFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-convolution - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-convolution is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$8 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$8 = "precision mediump float;\r\n\r\nvarying mediump vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\nuniform vec2 texelSize;\r\nuniform float matrix[9];\r\n\r\nvoid main(void)\r\n{\r\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\r\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\r\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\r\n\r\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\r\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\r\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\r\n\r\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\r\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\r\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\r\n\r\n   gl_FragColor =\r\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\r\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\r\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\r\n\r\n   gl_FragColor.a = c22.a;\r\n}\r\n";

/**
 * The ConvolutionFilter class applies a matrix convolution filter effect.
 * A convolution combines pixels in the input image with neighboring pixels to produce a new image.
 * A wide variety of image effects can be achieved through convolutions, including blurring, edge
 * detection, sharpening, embossing, and beveling. The matrix should be specified as a 9 point Array.
 * See http://docs.gimp.org/en/plug-in-convmatrix.html for more info.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/convolution.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param matrix {number[]} An array of values used for matrix transformation. Specified as a 9 point Array.
 * @param width {number} Width of the object you are transforming
 * @param height {number} Height of the object you are transforming
 */
var ConvolutionFilter = (function (superclass) {
    function ConvolutionFilter(matrix, width, height) {
        superclass.call(this, vertex$8, fragment$8);
        this.uniforms.texelSize = new Float32Array(9);
        this.matrix = matrix;
        this.width = width;
        this.height = height;
    }

    if ( superclass ) { ConvolutionFilter.__proto__ = superclass; }
    ConvolutionFilter.prototype = Object.create( superclass && superclass.prototype );
    ConvolutionFilter.prototype.constructor = ConvolutionFilter;

    var prototypeAccessors = { matrix: { configurable: true },width: { configurable: true },height: { configurable: true } };

    /**
     * An array of values used for matrix transformation. Specified as a 9 point Array.
     *
     * @member {Array<number>}
     */
    prototypeAccessors.matrix.get = function () {
        return this.uniforms.matrix;
    };
    prototypeAccessors.matrix.set = function (value) {
        this.uniforms.matrix = new Float32Array(value);
    };

    /**
     * Width of the object you are transforming
     *
     * @member {number}
     */
    prototypeAccessors.width.get = function () {
        return 1/this.uniforms.texelSize[0];
    };
    prototypeAccessors.width.set = function (value) {
        this.uniforms.texelSize[0] = 1/value;
    };

    /**
     * Height of the object you are transforming
     *
     * @member {number}
     */
    prototypeAccessors.height.get = function () {
        return 1/this.uniforms.texelSize[1];
    };
    prototypeAccessors.height.set = function (value) {
        this.uniforms.texelSize[1] = 1/value;
    };

    Object.defineProperties( ConvolutionFilter.prototype, prototypeAccessors );

    return ConvolutionFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-cross-hatch - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-cross-hatch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$9 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$9 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void)\r\n{\r\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\r\n\r\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\r\n\r\n    if (lum < 1.00)\r\n    {\r\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\r\n        {\r\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\r\n        }\r\n    }\r\n\r\n    if (lum < 0.75)\r\n    {\r\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\r\n        {\r\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\r\n        }\r\n    }\r\n\r\n    if (lum < 0.50)\r\n    {\r\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\r\n        {\r\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\r\n        }\r\n    }\r\n\r\n    if (lum < 0.3)\r\n    {\r\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\r\n        {\r\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\r\n        }\r\n    }\r\n}\r\n";

/**
 * A Cross Hatch effect filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/cross-hatch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 */
var CrossHatchFilter = (function (superclass) {
    function CrossHatchFilter() {
        superclass.call(this, vertex$9, fragment$9);
    }

    if ( superclass ) { CrossHatchFilter.__proto__ = superclass; }
    CrossHatchFilter.prototype = Object.create( superclass && superclass.prototype );
    CrossHatchFilter.prototype.constructor = CrossHatchFilter;

    return CrossHatchFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-crt - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-crt is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$10 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$10 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec2 dimensions;\r\n\r\nconst float SQRT_2 = 1.414213;\r\n\r\nconst float light = 1.0;\r\n\r\nuniform float curvature;\r\nuniform float lineWidth;\r\nuniform float lineContrast;\r\nuniform bool verticalLine;\r\nuniform float noise;\r\nuniform float noiseSize;\r\n\r\nuniform float vignetting;\r\nuniform float vignettingAlpha;\r\nuniform float vignettingBlur;\r\n\r\nuniform float seed;\r\nuniform float time;\r\n\r\nfloat rand(vec2 co) {\r\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\nvoid main(void)\r\n{\r\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\r\n    vec2 coord = pixelCoord / dimensions;\r\n\r\n    vec2 dir = vec2(coord - vec2(0.5, 0.5));\r\n\r\n    float _c = curvature > 0. ? curvature : 1.;\r\n    float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\r\n    vec2 uv = dir * k;\r\n\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n    vec3 rgb = gl_FragColor.rgb;\r\n\r\n\r\n    if (noise > 0.0 && noiseSize > 0.0)\r\n    {\r\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\r\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\r\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\r\n        rgb += _noise * noise;\r\n    }\r\n\r\n    if (lineWidth > 0.0) {\r\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\r\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\r\n        rgb *= j;\r\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\r\n        rgb *= 0.99 + ceil(segment) * 0.015;\r\n    }\r\n\r\n    if (vignetting > 0.0)\r\n    {\r\n        float outter = SQRT_2 - vignetting * SQRT_2;\r\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\r\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\r\n    }\r\n\r\n    gl_FragColor.rgb = rgb;\r\n}\r\n";

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/crt.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of CRT effect
 * @param {number} [options.curvature=1.0] - Bent of interlaced lines, higher value means more bend
 * @param {number} [options.lineWidth=1.0] - Width of the interlaced lines
 * @param {number} [options.lineContrast=0.25] - Contrast of interlaced lines
 * @param {number} [options.verticalLine=false] - `true` is vertical lines, `false` is horizontal
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.seed=0] - A seed value to apply to the random noise generation
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [options.time=0] - For animating interlaced lines
 */
var CRTFilter = (function (superclass) {
    function CRTFilter(options) {
        superclass.call(this, vertex$10, fragment$10);
        this.uniforms.dimensions = new Float32Array(2);

        /**
         * For animating interlaced lines
         *
         * @member {number}
         * @default 0
         */
        this.time = 0;

        /**
         * A seed value to apply to the random noise generation
         *
         * @member {number}
         * @default 0
         */
        this.seed = 0;

        Object.assign(this, {
            curvature: 1.0,
            lineWidth: 1.0,
            lineContrast: 0.25,
            verticalLine: false,
            noise: 0.0,
            noiseSize: 1.0,
            seed: 0.0,
            vignetting: 0.3,
            vignettingAlpha: 1.0,
            vignettingBlur: 0.3,
            time: 0.0,
        }, options);
    }

    if ( superclass ) { CRTFilter.__proto__ = superclass; }
    CRTFilter.prototype = Object.create( superclass && superclass.prototype );
    CRTFilter.prototype.constructor = CRTFilter;

    var prototypeAccessors = { curvature: { configurable: true },lineWidth: { configurable: true },lineContrast: { configurable: true },verticalLine: { configurable: true },noise: { configurable: true },noiseSize: { configurable: true },vignetting: { configurable: true },vignettingAlpha: { configurable: true },vignettingBlur: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    CRTFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        this.uniforms.seed = this.seed;
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * Bent of interlaced lines, higher value means more bend
     *
     * @member {number}
     * @default 1
     */
    prototypeAccessors.curvature.set = function (value) {
        this.uniforms.curvature = value;
    };
    prototypeAccessors.curvature.get = function () {
        return this.uniforms.curvature;
    };

    /**
     * Width of interlaced lines
     *
     * @member {number}
     * @default 1
     */
    prototypeAccessors.lineWidth.set = function (value) {
        this.uniforms.lineWidth = value;
    };
    prototypeAccessors.lineWidth.get = function () {
        return this.uniforms.lineWidth;
    };

    /**
     * Contrast of interlaced lines
     *
     * @member {number}
     * @default 0.25
     */
    prototypeAccessors.lineContrast.set = function (value) {
        this.uniforms.lineContrast = value;
    };
    prototypeAccessors.lineContrast.get = function () {
        return this.uniforms.lineContrast;
    };

    /**
     * `true` for vertical lines, `false` for horizontal lines
     *
     * @member {boolean}
     * @default false
     */
    prototypeAccessors.verticalLine.set = function (value) {
        this.uniforms.verticalLine = value;
    };
    prototypeAccessors.verticalLine.get = function () {
        return this.uniforms.verticalLine;
    };

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.noise.set = function (value) {
        this.uniforms.noise = value;
    };
    prototypeAccessors.noise.get = function () {
        return this.uniforms.noise;
    };

    /**
     * The size of the noise particles
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.noiseSize.set = function (value) {
        this.uniforms.noiseSize = value;
    };
    prototypeAccessors.noiseSize.get = function () {
        return this.uniforms.noiseSize;
    };

    /**
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignetting.set = function (value) {
        this.uniforms.vignetting = value;
    };
    prototypeAccessors.vignetting.get = function () {
        return this.uniforms.vignetting;
    };

    /**
     * Amount of opacity of vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignettingAlpha.set = function (value) {
        this.uniforms.vignettingAlpha = value;
    };
    prototypeAccessors.vignettingAlpha.get = function () {
        return this.uniforms.vignettingAlpha;
    };

    /**
     * Blur intensity of the vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignettingBlur.set = function (value) {
        this.uniforms.vignettingBlur = value;
    };
    prototypeAccessors.vignettingBlur.get = function () {
        return this.uniforms.vignettingBlur;
    };

    Object.defineProperties( CRTFilter.prototype, prototypeAccessors );

    return CRTFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-dot - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-dot is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$11 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$11 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nuniform vec4 filterArea;\r\nuniform sampler2D uSampler;\r\n\r\nuniform float angle;\r\nuniform float scale;\r\n\r\nfloat pattern()\r\n{\r\n   float s = sin(angle), c = cos(angle);\r\n   vec2 tex = vTextureCoord * filterArea.xy;\r\n   vec2 point = vec2(\r\n       c * tex.x - s * tex.y,\r\n       s * tex.x + c * tex.y\r\n   ) * scale;\r\n   return (sin(point.x) * sin(point.y)) * 4.0;\r\n}\r\n\r\nvoid main()\r\n{\r\n   vec4 color = texture2D(uSampler, vTextureCoord);\r\n   float average = (color.r + color.g + color.b) / 3.0;\r\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\r\n}\r\n";

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [scale=1] The scale of the effect.
 * @param {number} [angle=5] The radius of the effect.
 */
var DotFilter = (function (superclass) {
    function DotFilter(scale, angle) {
        if ( scale === void 0 ) { scale = 1; }
        if ( angle === void 0 ) { angle = 5; }

        superclass.call(this, vertex$11, fragment$11);
        this.scale = scale;
        this.angle = angle;
    }

    if ( superclass ) { DotFilter.__proto__ = superclass; }
    DotFilter.prototype = Object.create( superclass && superclass.prototype );
    DotFilter.prototype.constructor = DotFilter;

    var prototypeAccessors = { scale: { configurable: true },angle: { configurable: true } };

    /**
     * The scale of the effect.
     * @member {number}
     * @default 1
     */
    prototypeAccessors.scale.get = function () {
        return this.uniforms.scale;
    };
    prototypeAccessors.scale.set = function (value) {
        this.uniforms.scale = value;
    };

    /**
     * The radius of the effect.
     * @member {number}
     * @default 5
     */
    prototypeAccessors.angle.get = function () {
        return this.uniforms.angle;
    };
    prototypeAccessors.angle.set = function (value) {
        this.uniforms.angle = value;
    };

    Object.defineProperties( DotFilter.prototype, prototypeAccessors );

    return DotFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-drop-shadow - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-drop-shadow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$12 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$12 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform float alpha;\r\nuniform vec3 color;\r\nvoid main(void){\r\n    vec4 sample = texture2D(uSampler, vTextureCoord);\r\n\r\n    // Un-premultiply alpha before applying the color\r\n    if (sample.a > 0.0) {\r\n        sample.rgb /= sample.a;\r\n    }\r\n\r\n    // Premultiply alpha again\r\n    sample.rgb = color.rgb * sample.a;\r\n\r\n    // alpha user alpha\r\n    sample *= alpha;\r\n\r\n    gl_FragColor = sample;\r\n}";

/**
 * Drop shadow filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/drop-shadow.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] Filter options
 * @param {number} [options.rotation=45] The angle of the shadow in degrees.
 * @param {number} [options.distance=5] Distance of shadow
 * @param {number} [options.color=0x000000] Color of the shadow
 * @param {number} [options.alpha=0.5] Alpha of the shadow
 * @param {number} [options.shadowOnly=false] Whether render shadow only
 * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
 * @param {number} [options.quality=3] - The quality of the Blur filter.
 * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
 * @param {number|number[]|PIXI.Point} [options.pixelSize=1] - the pixelSize of the Blur filter.
 * @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution of the Blur filter.
 */
var DropShadowFilter = (function (superclass) {
    function DropShadowFilter(options) {

        // Fallback support for ctor: (rotation, distance, blur, color, alpha)
        if (options && options.constructor !== Object) {
            // eslint-disable-next-line no-console
            console.warn('DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)');
            options = { rotation: options };
            if (arguments[1] !== undefined) {
                options.distance = arguments[1];
            }
            if (arguments[2] !== undefined) {
                options.blur = arguments[2];
            }
            if (arguments[3] !== undefined) {
                options.color = arguments[3];
            }
            if (arguments[4] !== undefined) {
                options.alpha = arguments[4];
            }
        }

        options = Object.assign({
            rotation: 45,
            distance: 5,
            color: 0x000000,
            alpha: 0.5,
            shadowOnly: false,
            kernels: null,
            blur: 2,
            quality: 3,
            pixelSize: 1,
            resolution: pixi_js.settings.RESOLUTION,
        }, options);

        superclass.call(this);

        var kernels = options.kernels;
        var blur = options.blur;
        var quality = options.quality;
        var pixelSize = options.pixelSize;
        var resolution = options.resolution;

        this._tintFilter = new pixi_js.Filter(vertex$12, fragment$12);
        this._tintFilter.uniforms.color = new Float32Array(4);
        this._tintFilter.resolution = resolution;
        this._blurFilter = kernels ?
            new KawaseBlurFilter(kernels) :
            new KawaseBlurFilter(blur, quality);

        this.pixelSize = pixelSize;
        this.resolution = resolution;

        this.targetTransform = new pixi_js.Matrix();

        var shadowOnly = options.shadowOnly;
        var rotation = options.rotation;
        var distance = options.distance;
        var alpha = options.alpha;
        var color = options.color;

        this.shadowOnly = shadowOnly;
        this.rotation = rotation;
        this.distance = distance;
        this.alpha = alpha;
        this.color = color;

        this._updatePadding();
    }

    if ( superclass ) { DropShadowFilter.__proto__ = superclass; }
    DropShadowFilter.prototype = Object.create( superclass && superclass.prototype );
    DropShadowFilter.prototype.constructor = DropShadowFilter;

    var prototypeAccessors = { resolution: { configurable: true },distance: { configurable: true },rotation: { configurable: true },alpha: { configurable: true },color: { configurable: true },kernels: { configurable: true },blur: { configurable: true },quality: { configurable: true },pixelSize: { configurable: true } };

    DropShadowFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        var target = filterManager.getRenderTarget();

        target.transform = this.targetTransform;
        this._tintFilter.apply(filterManager, input, target, true);
        target.transform = null;

        this._blurFilter.apply(filterManager, target, output);

        if (this.shadowOnly !== true) {
            filterManager.applyFilter(this, input, output, clear);
        }

        filterManager.returnRenderTarget(target);
    };

    /**
     * Recalculate the proper padding amount.
     * @private
     */
    DropShadowFilter.prototype._updatePadding = function _updatePadding () {
        this.padding = this.distance + (this.blur * 2);
    };

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    DropShadowFilter.prototype._updateTargetTransform = function _updateTargetTransform () {
        this.targetTransform.tx = this.distance * Math.cos(this.angle);
        this.targetTransform.ty = this.distance * Math.sin(this.angle);
    };

    /**
     * The resolution of the filter.
     *
     * @member {number}
     * @default PIXI.settings.RESOLUTION
     */
    prototypeAccessors.resolution.get = function () {
        return this._resolution;
    };
    prototypeAccessors.resolution.set = function (value) {
        this._resolution = value;

        if (this._tintFilter) {
            this._tintFilter.resolution = value;
        }
        if (this._blurFilter) {
            this._blurFilter.resolution = value;
        }
    };

    /**
     * Distance offset of the shadow
     * @member {number}
     * @default 5
     */
    prototypeAccessors.distance.get = function () {
        return this._distance;
    };
    prototypeAccessors.distance.set = function (value) {
        this._distance = value;
        this._updatePadding();
        this._updateTargetTransform();
    };

    /**
     * The angle of the shadow in degrees
     * @member {number}
     * @default 2
     */
    prototypeAccessors.rotation.get = function () {
        return this.angle / pixi_js.DEG_TO_RAD;
    };
    prototypeAccessors.rotation.set = function (value) {
        this.angle = value * pixi_js.DEG_TO_RAD;
        this._updateTargetTransform();
    };

    /**
     * The alpha of the shadow
     * @member {number}
     * @default 1
     */
    prototypeAccessors.alpha.get = function () {
        return this._tintFilter.uniforms.alpha;
    };
    prototypeAccessors.alpha.set = function (value) {
        this._tintFilter.uniforms.alpha = value;
    };

    /**
     * The color of the shadow.
     * @member {number}
     * @default 0x000000
     */
    prototypeAccessors.color.get = function () {
        return pixi_js.utils.rgb2hex(this._tintFilter.uniforms.color);
    };
    prototypeAccessors.color.set = function (value) {
        pixi_js.utils.hex2rgb(value, this._tintFilter.uniforms.color);
    };

    /**
     * Sets the kernels of the Blur Filter
     *
     * @member {number[]}
     */
    prototypeAccessors.kernels.get = function () {
        return this._blurFilter.kernels;
    };
    prototypeAccessors.kernels.set = function (value) {
        this._blurFilter.kernels = value;
    };

    /**
     * The blur of the shadow
     * @member {number}
     * @default 2
     */
    prototypeAccessors.blur.get = function () {
        return this._blurFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this._blurFilter.blur = value;
        this._updatePadding();
    };

    /**
     * Sets the quality of the Blur Filter
     *
     * @member {number}
     * @default 4
     */
    prototypeAccessors.quality.get = function () {
        return this._blurFilter.quality;
    };
    prototypeAccessors.quality.set = function (value) {
        this._blurFilter.quality = value;
    };

    /**
     * Sets the pixelSize of the Kawase Blur filter
     *
     * @member {number|number[]|PIXI.Point}
     * @default 1
     */
    prototypeAccessors.pixelSize.get = function () {
        return this._blurFilter.pixelSize;
    };
    prototypeAccessors.pixelSize.set = function (value) {
        this._blurFilter.pixelSize = value;
    };

    Object.defineProperties( DropShadowFilter.prototype, prototypeAccessors );

    return DropShadowFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-emboss - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-emboss is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$13 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$13 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\nuniform float strength;\r\nuniform vec4 filterArea;\r\n\r\n\r\nvoid main(void)\r\n{\r\n\tvec2 onePixel = vec2(1.0 / filterArea);\r\n\r\n\tvec4 color;\r\n\r\n\tcolor.rgb = vec3(0.5);\r\n\r\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\r\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\r\n\r\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\r\n\r\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\r\n\r\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\r\n}\r\n";

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/emboss.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=5] Strength of the emboss.
 */
var EmbossFilter = (function (superclass) {
    function EmbossFilter(strength){
        if ( strength === void 0 ) { strength = 5; }

        superclass.call(this, vertex$13, fragment$13);
        this.strength = strength;
    }

    if ( superclass ) { EmbossFilter.__proto__ = superclass; }
    EmbossFilter.prototype = Object.create( superclass && superclass.prototype );
    EmbossFilter.prototype.constructor = EmbossFilter;

    var prototypeAccessors = { strength: { configurable: true } };

    /**
     * Strength of emboss.
     *
     * @member {number}
     */
    prototypeAccessors.strength.get = function () {
        return this.uniforms.strength;
    };
    prototypeAccessors.strength.set = function (value) {
        this.uniforms.strength = value;
    };

    Object.defineProperties( EmbossFilter.prototype, prototypeAccessors );

    return EmbossFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-glitch - v2.6.1
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-glitch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$14 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$14 = "// precision highp float;\r\n\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\nuniform float aspect;\r\n\r\nuniform sampler2D displacementMap;\r\nuniform float offset;\r\nuniform float sinDir;\r\nuniform float cosDir;\r\nuniform int fillMode;\r\n\r\nuniform float seed;\r\nuniform vec2 red;\r\nuniform vec2 green;\r\nuniform vec2 blue;\r\n\r\nconst int TRANSPARENT = 0;\r\nconst int ORIGINAL = 1;\r\nconst int LOOP = 2;\r\nconst int CLAMP = 3;\r\nconst int MIRROR = 4;\r\n\r\nvoid main(void)\r\n{\r\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\r\n\r\n    if (coord.x > 1.0 || coord.y > 1.0) {\r\n        return;\r\n    }\r\n\r\n    float cx = coord.x - 0.5;\r\n    float cy = (coord.y - 0.5) * aspect;\r\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\r\n\r\n    // displacementMap: repeat\r\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\r\n\r\n    // displacementMap: mirror\r\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\r\n\r\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\r\n\r\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\r\n\r\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\r\n\r\n    if (fillMode == CLAMP) {\r\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\r\n    } else {\r\n        if( coord.x > filterClamp.z ) {\r\n            if (fillMode == ORIGINAL) {\r\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n                return;\r\n            } else if (fillMode == LOOP) {\r\n                coord.x -= filterClamp.z;\r\n            } else if (fillMode == MIRROR) {\r\n                coord.x = filterClamp.z * 2.0 - coord.x;\r\n            } else {\r\n                gl_FragColor = vec4(0., 0., 0., 0.);\r\n                return;\r\n            }\r\n        } else if( coord.x < filterClamp.x ) {\r\n            if (fillMode == ORIGINAL) {\r\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n                return;\r\n            } else if (fillMode == LOOP) {\r\n                coord.x += filterClamp.z;\r\n            } else if (fillMode == MIRROR) {\r\n                coord.x *= -filterClamp.z;\r\n            } else {\r\n                gl_FragColor = vec4(0., 0., 0., 0.);\r\n                return;\r\n            }\r\n        }\r\n\r\n        if( coord.y > filterClamp.w ) {\r\n            if (fillMode == ORIGINAL) {\r\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n                return;\r\n            } else if (fillMode == LOOP) {\r\n                coord.y -= filterClamp.w;\r\n            } else if (fillMode == MIRROR) {\r\n                coord.y = filterClamp.w * 2.0 - coord.y;\r\n            } else {\r\n                gl_FragColor = vec4(0., 0., 0., 0.);\r\n                return;\r\n            }\r\n        } else if( coord.y < filterClamp.y ) {\r\n            if (fillMode == ORIGINAL) {\r\n                gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n                return;\r\n            } else if (fillMode == LOOP) {\r\n                coord.y += filterClamp.w;\r\n            } else if (fillMode == MIRROR) {\r\n                coord.y *= -filterClamp.w;\r\n            } else {\r\n                gl_FragColor = vec4(0., 0., 0., 0.);\r\n                return;\r\n            }\r\n        }\r\n    }\r\n\r\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\r\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\r\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\r\n    gl_FragColor.a = texture2D(uSampler, coord).a;\r\n}\r\n";

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {object} [options] - The more optional parameters of the filter.
 * @param {number} [options.slices=5] - The maximum number of slices.
 * @param {number} [options.offset=100] - The maximum offset amount of slices.
 * @param {number} [options.direction=0] - The angle in degree of the offset of slices.
 * @param {number} [options.fillMode=0] - The fill mode of the space after the offset. Acceptable values:
 *  - `0` {@link PIXI.filters.GlitchFilter.TRANSPARENT TRANSPARENT}
 *  - `1` {@link PIXI.filters.GlitchFilter.ORIGINAL ORIGINAL}
 *  - `2` {@link PIXI.filters.GlitchFilter.LOOP LOOP}
 *  - `3` {@link PIXI.filters.GlitchFilter.CLAMP CLAMP}
 *  - `4` {@link PIXI.filters.GlitchFilter.MIRROR MIRROR}
 * @param {number} [options.seed=0] - A seed value for randomizing glitch effect.
 * @param {number} [options.average=false] - `true` will divide the bands roughly based on equal amounts
 *                 where as setting to `false` will vary the band sizes dramatically (more random looking).
 * @param {number} [options.minSize=8] - Minimum size of individual slice. Segment of total `sampleSize`
 * @param {number} [options.sampleSize=512] - The resolution of the displacement map texture.
 * @param {number} [options.red=[0,0]] - Red channel offset
 * @param {number} [options.green=[0,0]] - Green channel offset.
 * @param {number} [options.blue=[0,0]] - Blue channel offset.
 */
var GlitchFilter = (function (superclass) {
    function GlitchFilter(options) {
        if ( options === void 0 ) { options = {}; }


        superclass.call(this, vertex$14, fragment$14);
        this.uniforms.dimensions = new Float32Array(2);

        options = Object.assign({
            slices: 5,
            offset: 100,
            direction: 0,
            fillMode: 0,
            average: false,
            seed: 0,
            red: [0, 0],
            green: [0, 0],
            blue: [0, 0],
            minSize: 8,
            sampleSize: 512,
        }, options);

        this.direction = options.direction;
        this.red = options.red;
        this.green = options.green;
        this.blue = options.blue;

        /**
         * The maximum offset value for each of the slices.
         *
         * @member {number}
         */
        this.offset = options.offset;

        /**
         * The fill mode of the space after the offset.
         *
         * @member {number}
         */
        this.fillMode = options.fillMode;

        /**
         * `true` will divide the bands roughly based on equal amounts
         * where as setting to `false` will vary the band sizes dramatically (more random looking).
         *
         * @member {boolean}
         * @default false
         */
        this.average = options.average;

        /**
         * A seed value for randomizing color offset. Animating
         * this value to `Math.random()` produces a twitching effect.
         *
         * @member {number}
         */
        this.seed = options.seed;

        /**
         * Minimum size of slices as a portion of the `sampleSize`
         *
         * @member {number}
         */
        this.minSize = options.minSize;

        /**
         * Height of the displacement map canvas.
         *
         * @member {number}
         * @readonly
         */
        this.sampleSize = options.sampleSize;

        /**
         * Internally generated canvas.
         *
         * @member {HTMLCanvasElement} _canvas
         * @private
         */
        this._canvas = document.createElement('canvas');
        this._canvas.width = 4;
        this._canvas.height = this.sampleSize;

        /**
         * The displacement map is used to generate the bands.
         * If using your own texture, `slices` will be ignored.
         *
         * @member {PIXI.Texture}
         * @readonly
         */
        this.texture = pixi_js.Texture.fromCanvas(this._canvas, pixi_js.SCALE_MODES.NEAREST);

        /**
         * Internal number of slices
         * @member {number}
         * @private
         */
        this._slices = 0;

        // Set slices
        this.slices = options.slices;
    }

    if ( superclass ) { GlitchFilter.__proto__ = superclass; }
    GlitchFilter.prototype = Object.create( superclass && superclass.prototype );
    GlitchFilter.prototype.constructor = GlitchFilter;

    var prototypeAccessors = { sizes: { configurable: true },offsets: { configurable: true },slices: { configurable: true },direction: { configurable: true },red: { configurable: true },green: { configurable: true },blue: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    GlitchFilter.prototype.apply = function apply (filterManager, input, output, clear) {

        var width = input.sourceFrame.width;
        var height = input.sourceFrame.height;

        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;

        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.fillMode = this.fillMode;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    GlitchFilter.prototype._randomizeSizes = function _randomizeSizes () {
        var arr = this._sizes;
        var last = this._slices - 1;
        var size = this.sampleSize;
        var min = Math.min(this.minSize / size, 0.9 / this._slices);

        if (this.average) {
            var count = this._slices;
            var rest = 1;

            for (var i = 0; i < last; i++) {
                var averageWidth = rest / (count - i);
                var w =  Math.max(averageWidth * (1 - Math.random() * 0.6), min);
                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        else {
            var rest$1 = 1;
            var ratio = Math.sqrt(1 / this._slices);

            for (var i$1 = 0; i$1 < last; i$1++) {
                var w$1 = Math.max(ratio * rest$1 * Math.random(), min);
                arr[i$1] = w$1;
                rest$1 -= w$1;
            }
            arr[last] = rest$1;
        }

        this.shuffle();
    };

    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    GlitchFilter.prototype.shuffle = function shuffle () {
        var arr = this._sizes;
        var last = this._slices - 1;

        // shuffle
        for (var i = last; i > 0; i--) {
            var rand = (Math.random() * i) >> 0;
            var temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    };

    /**
     * Randomize the values for offset from -1 to 1
     *
     * @private
     */
    GlitchFilter.prototype._randomizeOffsets = function _randomizeOffsets () {
        var this$1 = this;

        for (var i = 0 ; i < this._slices; i++) {
            this$1._offsets[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    };

    /**
     * Regenerating random size, offsets for slices.
     */
    GlitchFilter.prototype.refresh = function refresh () {
        this._randomizeSizes();
        this._randomizeOffsets();
        this.redraw();
    };

    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    GlitchFilter.prototype.redraw = function redraw () {
        var this$1 = this;

        var size = this.sampleSize;
        var texture = this.texture;
        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, 8, size);

        var offset;
        var y = 0;

        for (var i = 0 ; i < this._slices; i++) {
            offset = Math.floor(this$1._offsets[i] * 256);
            var height = this$1._sizes[i] * size;
            var red = offset > 0 ? offset : 0;
            var green = offset < 0 ? -offset : 0;
            ctx.fillStyle = 'rgba(' + red + ', ' + green + ', 0, 1)';
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        texture.baseTexture.emit('update', texture.baseTexture);
        this.uniforms.displacementMap = texture;
    };

    /**
     * Manually custom slices size (height) of displacement bitmap
     *
     * @member {number[]}
     */
    prototypeAccessors.sizes.set = function (sizes) {
        var this$1 = this;

        var len = Math.min(this._slices, sizes.length);

        for (var i = 0; i < len; i++){
            this$1._sizes[i] = sizes[i];
        }
    };
    prototypeAccessors.sizes.get = function () {
        return this._sizes;
    };

    /**
     * Manually set custom slices offset of displacement bitmap, this is
     * a collection of values from -1 to 1. To change the max offset value
     * set `offset`.
     *
     * @member {number[]}
     */
    prototypeAccessors.offsets.set = function (offsets) {
        var this$1 = this;

        var len = Math.min(this._slices, offsets.length);

        for (var i = 0; i < len; i++){
            this$1._offsets[i] = offsets[i];
        }
    };
    prototypeAccessors.offsets.get = function () {
        return this._offsets;
    };

    /**
     * The count of slices.
     * @member {number}
     * @default 5
     */
    prototypeAccessors.slices.get = function () {
        return this._slices;
    };
    prototypeAccessors.slices.set = function (value) {
        if (this._slices === value) {
            return;
        }
        this._slices = value;
        this.uniforms.slices = value;
        this._sizes = this.uniforms.slicesWidth = new Float32Array(value);
        this._offsets = this.uniforms.slicesOffset = new Float32Array(value);
        this.refresh();
    };

    /**
     * The angle in degree of the offset of slices.
     * @member {number}
     * @default 0
     */
    prototypeAccessors.direction.get = function () {
        return this._direction;
    };
    prototypeAccessors.direction.set = function (value) {
        if (this._direction === value) {
            return;
        }
        this._direction = value;

        var radians = value * pixi_js.DEG_TO_RAD;

        this.uniforms.sinDir = Math.sin(radians);
        this.uniforms.cosDir = Math.cos(radians);
    };

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.red.get = function () {
        return this.uniforms.red;
    };
    prototypeAccessors.red.set = function (value) {
        this.uniforms.red = value;
    };

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.green.get = function () {
        return this.uniforms.green;
    };
    prototypeAccessors.green.set = function (value) {
        this.uniforms.green = value;
    };

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.blue.get = function () {
        return this.uniforms.blue;
    };
    prototypeAccessors.blue.set = function (value) {
        this.uniforms.blue = value;
    };

    /**
     * Removes all references
     */
    GlitchFilter.prototype.destroy = function destroy () {
        this.texture.destroy(true);
        this.texture = null;
        this._canvas = null;
        this.red = null;
        this.green = null;
        this.blue = null;
        this._sizes = null;
        this._offsets = null;
    };

    Object.defineProperties( GlitchFilter.prototype, prototypeAccessors );

    return GlitchFilter;
}(pixi_js.Filter));

/**
 * Fill mode as transparent
 *
 * @constant
 * @static
 * @member {int} TRANSPARENT
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.TRANSPARENT = 0;

/**
 * Fill mode as original
 *
 * @constant
 * @static
 * @member {int} ORIGINAL
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.ORIGINAL = 1;

/**
 * Fill mode as loop
 *
 * @constant
 * @static
 * @member {int} LOOP
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.LOOP = 2;

/**
 * Fill mode as clamp
 *
 * @constant
 * @static
 * @member {int} CLAMP
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.CLAMP = 3;

/**
 * Fill mode as mirror
 *
 * @constant
 * @static
 * @member {int} MIRROR
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.MIRROR = 4;

/*!
 * @pixi/filter-glow - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-glow is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$15 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$15 = "varying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float distance;\r\nuniform float outerStrength;\r\nuniform float innerStrength;\r\nuniform vec4 glowColor;\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nconst float PI = 3.14159265358979323846264;\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    vec2 displaced;\r\n    for (float angle = 0.0; angle <= PI * 2.0; angle += %QUALITY_DIST%) {\r\n       cosAngle = cos(angle);\r\n       sinAngle = sin(angle);\r\n       for (float curDistance = 1.0; curDistance <= %DIST%; curDistance++) {\r\n           displaced.x = vTextureCoord.x + cosAngle * curDistance * px.x;\r\n           displaced.y = vTextureCoord.y + sinAngle * curDistance * px.y;\r\n           curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\r\n           totalAlpha += (distance - curDistance) * curColor.a;\r\n           maxTotalAlpha += (distance - curDistance);\r\n       }\r\n    }\r\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\r\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\r\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\r\n}\r\n";

/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glow.png)
 *
 * @class
 *
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [distance=10] The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
 * @param {number} [outerStrength=4] The strength of the glow outward from the edge of the sprite.
 * @param {number} [innerStrength=0] The strength of the glow inward from the edge of the sprite.
 * @param {number} [color=0xffffff] The color of the glow.
 * @param {number} [quality=0.1] A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */
var GlowFilter = (function (superclass) {
    function GlowFilter(distance, outerStrength, innerStrength, color, quality) {
        if ( distance === void 0 ) { distance = 10; }
        if ( outerStrength === void 0 ) { outerStrength = 4; }
        if ( innerStrength === void 0 ) { innerStrength = 0; }
        if ( color === void 0 ) { color = 0xffffff; }
        if ( quality === void 0 ) { quality = 0.1; }

        superclass.call(this, vertex$15, fragment$15
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7)));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
    }

    if ( superclass ) { GlowFilter.__proto__ = superclass; }
    GlowFilter.prototype = Object.create( superclass && superclass.prototype );
    GlowFilter.prototype.constructor = GlowFilter;

    var prototypeAccessors = { color: { configurable: true },distance: { configurable: true },outerStrength: { configurable: true },innerStrength: { configurable: true } };

    /**
     * The color of the glow.
     * @member {number}
     * @default 0xFFFFFF
     */
    prototypeAccessors.color.get = function () {
        return pixi_js.utils.rgb2hex(this.uniforms.glowColor);
    };
    prototypeAccessors.color.set = function (value) {
        pixi_js.utils.hex2rgb(value, this.uniforms.glowColor);
    };

    /**
     * The distance of the glow. Make it 2 times more for resolution=2. It cant be changed after filter creation
     * @member {number}
     * @default 10
     */
    prototypeAccessors.distance.get = function () {
        return this.uniforms.distance;
    };
    prototypeAccessors.distance.set = function (value) {
        this.uniforms.distance = value;
    };

    /**
     * The strength of the glow outward from the edge of the sprite.
     * @member {number}
     * @default 4
     */
    prototypeAccessors.outerStrength.get = function () {
        return this.uniforms.outerStrength;
    };
    prototypeAccessors.outerStrength.set = function (value) {
        this.uniforms.outerStrength = value;
    };

    /**
     * The strength of the glow inward from the edge of the sprite.
     * @member {number}
     * @default 0
     */
    prototypeAccessors.innerStrength.get = function () {
        return this.uniforms.innerStrength;
    };
    prototypeAccessors.innerStrength.set = function (value) {
        this.uniforms.innerStrength = value;
    };

    Object.defineProperties( GlowFilter.prototype, prototypeAccessors );

    return GlowFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-godray - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-godray is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$16 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var perlin = "vec3 mod289(vec3 x)\r\n{\r\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\r\n}\r\nvec4 mod289(vec4 x)\r\n{\r\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\r\n}\r\nvec4 permute(vec4 x)\r\n{\r\n    return mod289(((x * 34.0) + 1.0) * x);\r\n}\r\nvec4 taylorInvSqrt(vec4 r)\r\n{\r\n    return 1.79284291400159 - 0.85373472095314 * r;\r\n}\r\nvec3 fade(vec3 t)\r\n{\r\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\r\n}\r\n// Classic Perlin noise, periodic variant\r\nfloat pnoise(vec3 P, vec3 rep)\r\n{\r\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\r\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\r\n    Pi0 = mod289(Pi0);\r\n    Pi1 = mod289(Pi1);\r\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\r\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\r\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\r\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\r\n    vec4 iz0 = Pi0.zzzz;\r\n    vec4 iz1 = Pi1.zzzz;\r\n    vec4 ixy = permute(permute(ix) + iy);\r\n    vec4 ixy0 = permute(ixy + iz0);\r\n    vec4 ixy1 = permute(ixy + iz1);\r\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\r\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\r\n    gx0 = fract(gx0);\r\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\r\n    vec4 sz0 = step(gz0, vec4(0.0));\r\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\r\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\r\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\r\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\r\n    gx1 = fract(gx1);\r\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\r\n    vec4 sz1 = step(gz1, vec4(0.0));\r\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\r\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\r\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\r\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\r\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\r\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\r\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\r\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\r\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\r\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\r\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\r\n    g000 *= norm0.x;\r\n    g010 *= norm0.y;\r\n    g100 *= norm0.z;\r\n    g110 *= norm0.w;\r\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\r\n    g001 *= norm1.x;\r\n    g011 *= norm1.y;\r\n    g101 *= norm1.z;\r\n    g111 *= norm1.w;\r\n    float n000 = dot(g000, Pf0);\r\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\r\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\r\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\r\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\r\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\r\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\r\n    float n111 = dot(g111, Pf1);\r\n    vec3 fade_xyz = fade(Pf0);\r\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\r\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\r\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\r\n    return 2.2 * n_xyz;\r\n}\r\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\r\n{\r\n    float sum = 0.0;\r\n    float sc = 1.0;\r\n    float totalgain = 1.0;\r\n    for (float i = 0.0; i < 6.0; i++)\r\n    {\r\n        sum += totalgain * pnoise(P * sc, rep);\r\n        sc *= lacunarity;\r\n        totalgain *= gain;\r\n    }\r\n    return abs(sum);\r\n}\r\n";

var fragment$16 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\nuniform vec2 dimensions;\r\n\r\nuniform vec2 light;\r\nuniform bool parallel;\r\nuniform float aspect;\r\n\r\nuniform float gain;\r\nuniform float lacunarity;\r\nuniform float time;\r\n\r\n${perlin}\r\n\r\nvoid main(void) {\r\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\r\n\r\n    float d;\r\n\r\n    if (parallel) {\r\n        float _cos = light.x;\r\n        float _sin = light.y;\r\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\r\n    } else {\r\n        float dx = coord.x - light.x / dimensions.x;\r\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\r\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\r\n        d = dy / dis;\r\n    }\r\n\r\n    vec3 dir = vec3(d, d, 0.0);\r\n\r\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\r\n    noise = mix(noise, 0.0, 0.3);\r\n    //fade vertically.\r\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\r\n    mist.a = 1.0;\r\n\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\r\n}\r\n";

/**
* GordayFilter, {@link https://codepen.io/alaingalvan originally} by Alain Galvan
*
*
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/godray.gif)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
*
* @example
*  displayObject.filters = [new GodrayFilter()];
* @param {object} [options] Filter options
* @param {number} [options.angle=30] Angle/Light-source of the rays.
* @param {number} [options.gain=0.5] General intensity of the effect.
* @param {number} [options.lacunrity=2.5] The density of the fractal noise.
* @param {boolean} [options.parallel=true] `true` to use `angle`, `false` to use `center`
* @param {number} [options.time=0] The current time position.
* @param {PIXI.Point|number[]} [options.center=[0,0]] Focal point for non-parallel rays,
*        to use this `parallel` must be set to `false`.
*/
var GodrayFilter = (function (superclass) {
    function GodrayFilter(options) {
        superclass.call(this, vertex$16, fragment$16.replace('${perlin}', perlin));

        this.uniforms.dimensions = new Float32Array(2);

        // Fallback support for ctor: (angle, gain, lacunarity, time)
        if (typeof options === 'number') {
            // eslint-disable-next-line no-console
            console.warn('GodrayFilter now uses options instead of (angle, gain, lacunarity, time)');
            options = { angle: options };
            if (arguments[1] !== undefined) {
                options.gain = arguments[1];
            }
            if (arguments[2] !== undefined) {
                options.lacunarity = arguments[2];
            }
            if (arguments[3] !== undefined) {
                options.time = arguments[3];
            }
        }

        options = Object.assign({
            angle: 30,
            gain: 0.5,
            lacunarity: 2.5,
            time: 0,
            parallel: true,
            center: [0, 0],
        }, options);

        this._angleLight = new pixi_js.Point();
        this.angle = options.angle;
        this.gain = options.gain;
        this.lacunarity = options.lacunarity;

        /**
         * `true` if light rays are parallel (uses angle),
         * `false` to use the focal `center` point
         *
         * @member {boolean}
         * @default true
         */
        this.parallel = options.parallel;

        /**
         * The position of the emitting point for light rays
         * only used if `parallel` is set to `false`.
         *
         * @member {PIXI.Point|number[]}
         * @default [0, 0]
         */
        this.center = options.center;

        /**
         * The current time.
         *
         * @member {number}
         * @default 0
         */
        this.time = options.time;
    }

    if ( superclass ) { GodrayFilter.__proto__ = superclass; }
    GodrayFilter.prototype = Object.create( superclass && superclass.prototype );
    GodrayFilter.prototype.constructor = GodrayFilter;

    var prototypeAccessors = { angle: { configurable: true },gain: { configurable: true },lacunarity: { configurable: true } };

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    GodrayFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        var ref = input.sourceFrame;
        var width = ref.width;
        var height = ref.height;

        this.uniforms.light = this.parallel ? this._angleLight : this.center;

        this.uniforms.parallel = this.parallel;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.uniforms.time = this.time;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * The angle/light-source of the rays in degrees. For instance, a value of 0 is vertical rays,
     *     values of 90 or -90 produce horizontal rays.
     * @member {number}
     * @default 30
     */
    prototypeAccessors.angle.get = function () {
        return this._angle;
    };
    prototypeAccessors.angle.set = function (value) {
        this._angle = value;

        var radians = value * pixi_js.DEG_TO_RAD;

        this._angleLight.x = Math.cos(radians);
        this._angleLight.y = Math.sin(radians);
    };

    /**
     * General intensity of the effect. A value closer to 1 will produce a more intense effect,
     * where a value closer to 0 will produce a subtler effect.
     *
     * @member {number}
     * @default 0.5
     */
    prototypeAccessors.gain.get = function () {
        return this.uniforms.gain;
    };
    prototypeAccessors.gain.set = function (value) {
        this.uniforms.gain = value;
    };

    /**
     * The density of the fractal noise. A higher amount produces more rays and a smaller amound
     * produces fewer waves.
     *
     * @member {number}
     * @default 2.5
     */
    prototypeAccessors.lacunarity.get = function () {
        return this.uniforms.lacunarity;
    };
    prototypeAccessors.lacunarity.set = function (value) {
        this.uniforms.lacunarity = value;
    };

    Object.defineProperties( GodrayFilter.prototype, prototypeAccessors );

    return GodrayFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-motion-blur - v2.6.1
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-motion-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$17 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$17 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\n\r\nuniform vec2 uVelocity;\r\nuniform int uKernelSize;\r\nuniform float uOffset;\r\n\r\nconst int MAX_KERNEL_SIZE = 2048;\r\n\r\n// Notice:\r\n// the perfect way:\r\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\r\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\r\n// So use uKernelSize directly.\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = texture2D(uSampler, vTextureCoord);\r\n\r\n    if (uKernelSize == 0)\r\n    {\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    vec2 velocity = uVelocity / filterArea.xy;\r\n    float offset = -uOffset / length(uVelocity) - 0.5;\r\n    int k = uKernelSize - 1;\r\n\r\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\r\n        if (i == k) {\r\n            break;\r\n        }\r\n        vec2 bias = velocity * (float(i) / float(k) + offset);\r\n        color += texture2D(uSampler, vTextureCoord + bias);\r\n    }\r\n    gl_FragColor = color / float(uKernelSize);\r\n}\r\n";

/**
 * The MotionBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/motion-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.ObservablePoint|PIXI.Point|number[]} [velocity=[0, 0]] Sets the velocity of the motion for blur effect.
 * @param {number} [kernelSize=5] - The kernelSize of the blur filter. Must be odd number >= 5
 * @param {number} [offset=0] - The offset of the blur filter.
 */
var MotionBlurFilter = (function (superclass) {
    function MotionBlurFilter(velocity, kernelSize, offset) {
        if ( velocity === void 0 ) { velocity = [0, 0]; }
        if ( kernelSize === void 0 ) { kernelSize = 5; }
        if ( offset === void 0 ) { offset = 0; }

        superclass.call(this, vertex$17, fragment$17);
        this.uniforms.uVelocity = new Float32Array(2);
        this._velocity = new pixi_js.ObservablePoint(this.velocityChanged, this);
        this.velocity = velocity;

        /**
         * The kernelSize of the blur, higher values are slower but look better.
         * Use odd value greater than 5.
         * @member {number}
         * @default 5
         */
        this.kernelSize = kernelSize;
        this.offset = offset;
    }

    if ( superclass ) { MotionBlurFilter.__proto__ = superclass; }
    MotionBlurFilter.prototype = Object.create( superclass && superclass.prototype );
    MotionBlurFilter.prototype.constructor = MotionBlurFilter;

    var prototypeAccessors = { velocity: { configurable: true },offset: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    MotionBlurFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        var ref = this.velocity;
        var x = ref.x;
        var y = ref.y;

        this.uniforms.uKernelSize = (x !== 0 || y !== 0) ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * Sets the velocity of the motion for blur effect.
     *
     * @member {PIXI.ObservablePoint}
     */
    prototypeAccessors.velocity.set = function (value) {
        if (Array.isArray(value)) {
            this._velocity.set(value[0], value[1]);
        }
        else if (value instanceof pixi_js.Point || value instanceof pixi_js.ObservablePoint) {
            this._velocity.copy(value);
        }
    };

    prototypeAccessors.velocity.get = function () {
        return this._velocity;
    };

    /**
     * Handle velocity changed
     * @private
     */
    MotionBlurFilter.prototype.velocityChanged = function velocityChanged () {
        this.uniforms.uVelocity[0] = this._velocity.x;
        this.uniforms.uVelocity[1] = this._velocity.y;
    };

    /**
     * The offset of the blur filter.
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.offset.set = function (value) {
        this.uniforms.uOffset = value;
    };

    prototypeAccessors.offset.get = function () {
        return this.uniforms.uOffset;
    };

    Object.defineProperties( MotionBlurFilter.prototype, prototypeAccessors );

    return MotionBlurFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-multi-color-replace - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-multi-color-replace is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$18 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$18 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform float epsilon;\r\n\r\nconst int MAX_COLORS = %maxColors%;\r\n\r\nuniform vec3 originalColors[MAX_COLORS];\r\nuniform vec3 targetColors[MAX_COLORS];\r\n\r\nvoid main(void)\r\n{\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n\r\n    float alpha = gl_FragColor.a;\r\n    if (alpha < 0.0001)\r\n    {\r\n      return;\r\n    }\r\n\r\n    vec3 color = gl_FragColor.rgb / alpha;\r\n\r\n    for(int i = 0; i < MAX_COLORS; i++)\r\n    {\r\n      vec3 origColor = originalColors[i];\r\n      if (origColor.r < 0.0)\r\n      {\r\n        break;\r\n      }\r\n      vec3 colorDiff = origColor - color;\r\n      if (length(colorDiff) < epsilon)\r\n      {\r\n        vec3 targetColor = targetColors[i];\r\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\r\n        return;\r\n      }\r\n    }\r\n}\r\n";

/**
 * Filter for replacing a color with another color. Similar to ColorReplaceFilter, but support multiple
 * colors.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/multi-color-replace.png)
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {Array<Array>} replacements - The collection of replacement items. Each item is color-pair (an array length is 2).
 *                       In the pair, the first value is original color , the second value is target color.
 * @param {number} [epsilon=0.05] - Tolerance of the floating-point comparison between colors
 *                                  (lower = more exact, higher = more inclusive)
 * @param {number} [maxColors] - The maximum number of replacements filter is able to use. Because the
 *                               fragment is only compiled once, this cannot be changed after construction.
 *                               If omitted, the default value is the length of `replacements`.
 *
 * @example
 *  // replaces pure red with pure blue, and replaces pure green with pure white
 *  someSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [0xFF0000, 0x0000FF],
 *      [0x00FF00, 0xFFFFFF]
 *    ],
 *    0.001
 *  )];
 *
 *  You also could use [R, G, B] as the color
 *  someOtherSprite.filters = [new MultiColorReplaceFilter(
 *    [
 *      [ [1,0,0], [0,0,1] ],
 *      [ [0,1,0], [1,1,1] ]
 *    ],
 *    0.001
 *  )];
 *
 */
var MultiColorReplaceFilter = (function (superclass) {
    function MultiColorReplaceFilter(replacements, epsilon, maxColors) {
        if ( epsilon === void 0 ) { epsilon = 0.05; }
        if ( maxColors === void 0 ) { maxColors = null; }

        maxColors = maxColors || replacements.length;

        superclass.call(this, vertex$18, fragment$18.replace(/%maxColors%/g, maxColors));

        this.epsilon = epsilon;
        this._maxColors = maxColors;
        this._replacements = null;
        this.uniforms.originalColors = new Float32Array(maxColors * 3);
        this.uniforms.targetColors = new Float32Array(maxColors * 3);
        this.replacements = replacements;
    }

    if ( superclass ) { MultiColorReplaceFilter.__proto__ = superclass; }
    MultiColorReplaceFilter.prototype = Object.create( superclass && superclass.prototype );
    MultiColorReplaceFilter.prototype.constructor = MultiColorReplaceFilter;

    var prototypeAccessors = { replacements: { configurable: true },maxColors: { configurable: true },epsilon: { configurable: true } };

    /**
     * The source and target colors for replacement. See constructor for information on the format.
     *
     * @member {Array<Array>}
     */
    prototypeAccessors.replacements.set = function (replacements) {
        var originals = this.uniforms.originalColors;
        var targets = this.uniforms.targetColors;
        var colorCount = replacements.length;

        if (colorCount > this._maxColors) {
            throw ("Length of replacements (" + colorCount + ") exceeds the maximum colors length (" + (this._maxColors) + ")");
        }

        // Fill with negative values
        originals[colorCount * 3] = -1;

        for (var i = 0; i < colorCount; i++) {
            var pair = replacements[i];

            // for original colors
            var color = pair[0];
            if (typeof color === 'number') {
                color = pixi_js.utils.hex2rgb(color);
            }
            else {
                pair[0] = pixi_js.utils.rgb2hex(color);
            }

            originals[i * 3] = color[0];
            originals[(i * 3) + 1] = color[1];
            originals[(i * 3) + 2] = color[2];

            // for target colors
            var targetColor = pair[1];
            if (typeof targetColor === 'number') {
                targetColor = pixi_js.utils.hex2rgb(targetColor);
            }
            else {
                pair[1] = pixi_js.utils.rgb2hex(targetColor);
            }

            targets[i * 3] = targetColor[0];
            targets[(i * 3) + 1] = targetColor[1];
            targets[(i * 3) + 2] = targetColor[2];
        }

        this._replacements = replacements;
    };
    prototypeAccessors.replacements.get = function () {
        return this._replacements;
    };

    /**
     * Should be called after changing any of the contents of the replacements.
     * This is a convenience method for resetting the `replacements`.
     */
    MultiColorReplaceFilter.prototype.refresh = function refresh () {
        this.replacements = this._replacements;
    };

    /**
     * The maximum number of color replacements supported by this filter. Can be changed
     * _only_ during construction.
     *
     * @member {number}
     * @readonly
     */
    prototypeAccessors.maxColors.get = function () {
        return this._maxColors;
    };

    /**
     * Tolerance of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
     *
     * @member {number}
     * @default 0.05
     */
    prototypeAccessors.epsilon.set = function (value) {
        this.uniforms.epsilon = value;
    };
    prototypeAccessors.epsilon.get = function () {
        return this.uniforms.epsilon;
    };

    Object.defineProperties( MultiColorReplaceFilter.prototype, prototypeAccessors );

    return MultiColorReplaceFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-old-film - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-old-film is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$19 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$19 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\nuniform vec2 dimensions;\r\n\r\nuniform float sepia;\r\nuniform float noise;\r\nuniform float noiseSize;\r\nuniform float scratch;\r\nuniform float scratchDensity;\r\nuniform float scratchWidth;\r\nuniform float vignetting;\r\nuniform float vignettingAlpha;\r\nuniform float vignettingBlur;\r\nuniform float seed;\r\n\r\nconst float SQRT_2 = 1.414213;\r\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\r\n\r\nfloat rand(vec2 co) {\r\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\nvec3 Overlay(vec3 src, vec3 dst)\r\n{\r\n    // if (dst <= 0.5) then: 2 * src * dst\r\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\r\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\r\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\r\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\r\n}\r\n\r\n\r\nvoid main()\r\n{\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n    vec3 color = gl_FragColor.rgb;\r\n\r\n    if (sepia > 0.0)\r\n    {\r\n        float gray = (color.x + color.y + color.z) / 3.0;\r\n        vec3 grayscale = vec3(gray);\r\n\r\n        color = Overlay(SEPIA_RGB, grayscale);\r\n\r\n        color = grayscale + sepia * (color - grayscale);\r\n    }\r\n\r\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\r\n\r\n    if (vignetting > 0.0)\r\n    {\r\n        float outter = SQRT_2 - vignetting * SQRT_2;\r\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\r\n        dir.y *= dimensions.y / dimensions.x;\r\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\r\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\r\n    }\r\n\r\n    if (scratchDensity > seed && scratch != 0.0)\r\n    {\r\n        float phase = seed * 256.0;\r\n        float s = mod(floor(phase), 2.0);\r\n        float dist = 1.0 / scratchDensity;\r\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\r\n        if (d < seed * 0.6 + 0.4)\r\n        {\r\n            highp float period = scratchDensity * 10.0;\r\n\r\n            float xx = coord.x * period + phase;\r\n            float aa = abs(mod(xx, 0.5) * 4.0);\r\n            float bb = mod(floor(xx / 0.5), 2.0);\r\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\r\n\r\n            float kk = 2.0 * period;\r\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\r\n            float dh = dw * kk;\r\n\r\n            float tine = (yy - (2.0 - dh));\r\n\r\n            if (tine > 0.0) {\r\n                float _sign = sign(scratch);\r\n\r\n                tine = s * tine / period + scratch + 0.1;\r\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\r\n\r\n                color.rgb *= tine;\r\n            }\r\n        }\r\n    }\r\n\r\n    if (noise > 0.0 && noiseSize > 0.0)\r\n    {\r\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\r\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\r\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\r\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\r\n        // float _noise = snoise(d) * 0.5;\r\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\r\n        color += _noise * noise;\r\n    }\r\n\r\n    gl_FragColor.rgb = color;\r\n}\r\n";

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/old-film.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of old film effect.
 *                        When options is a number , it will be `seed`
 * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
 *        a value of `1` is more saturation and closer to `0` is less, and a value of
 *        `0` produces no sepia effect
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.scratch=0.5] - How often scratches appear
 * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
 * @param {number} [options.scratchWidth=1.0] - The width of the scratches
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [seed=0] - A see value to apply to the random noise generation
 */
var OldFilmFilter = (function (superclass) {
    function OldFilmFilter(options, seed) {
        if ( seed === void 0 ) { seed = 0; }

        superclass.call(this, vertex$19, fragment$19);
        this.uniforms.dimensions = new Float32Array(2);

        if (typeof options === 'number') {
            this.seed = options;
            options = null;
        }
        else {
            /**
             * A see value to apply to the random noise generation
             * @member {number}
             */
            this.seed = seed;
        }

        Object.assign(this, {
            sepia: 0.3,
            noise: 0.3,
            noiseSize: 1.0,
            scratch: 0.5,
            scratchDensity: 0.3,
            scratchWidth: 1.0,
            vignetting: 0.3,
            vignettingAlpha: 1.0,
            vignettingBlur: 0.3,
        }, options);
    }

    if ( superclass ) { OldFilmFilter.__proto__ = superclass; }
    OldFilmFilter.prototype = Object.create( superclass && superclass.prototype );
    OldFilmFilter.prototype.constructor = OldFilmFilter;

    var prototypeAccessors = { sepia: { configurable: true },noise: { configurable: true },noiseSize: { configurable: true },scratch: { configurable: true },scratchDensity: { configurable: true },scratchWidth: { configurable: true },vignetting: { configurable: true },vignettingAlpha: { configurable: true },vignettingBlur: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    OldFilmFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // named `seed` because in the most programming languages,
        // `random` used for "the function for generating random value".
        this.uniforms.seed = this.seed;

        filterManager.applyFilter(this, input, output, clear);
    };


    /**
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less,
     * and a value of `0` produces no sepia effect
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.sepia.set = function (value) {
        this.uniforms.sepia = value;
    };

    prototypeAccessors.sepia.get = function () {
        return this.uniforms.sepia;
    };

    /**
     * Opacity/intensity of the noise effect between `0` and `1`
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.noise.set = function (value) {
        this.uniforms.noise = value;
    };

    prototypeAccessors.noise.get = function () {
        return this.uniforms.noise;
    };

    /**
     * The size of the noise particles
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.noiseSize.set = function (value) {
        this.uniforms.noiseSize = value;
    };

    prototypeAccessors.noiseSize.get = function () {
        return this.uniforms.noiseSize;
    };

    /**
     * How often scratches appear
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.scratch.set = function (value) {
        this.uniforms.scratch = value;
    };

    prototypeAccessors.scratch.get = function () {
        return this.uniforms.scratch;
    };

    /**
     * The density of the number of scratches
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.scratchDensity.set = function (value) {
        this.uniforms.scratchDensity = value;
    };

    prototypeAccessors.scratchDensity.get = function () {
        return this.uniforms.scratchDensity;
    };

    /**
     * The width of the scratches
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.scratchWidth.set = function (value) {
        this.uniforms.scratchWidth = value;
    };

    prototypeAccessors.scratchWidth.get = function () {
        return this.uniforms.scratchWidth;
    };

    /**
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignetting.set = function (value) {
        this.uniforms.vignetting = value;
    };

    prototypeAccessors.vignetting.get = function () {
        return this.uniforms.vignetting;
    };

    /**
     * Amount of opacity of vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignettingAlpha.set = function (value) {
        this.uniforms.vignettingAlpha = value;
    };

    prototypeAccessors.vignettingAlpha.get = function () {
        return this.uniforms.vignettingAlpha;
    };

    /**
     * Blur intensity of the vignette
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.vignettingBlur.set = function (value) {
        this.uniforms.vignettingBlur = value;
    };

    prototypeAccessors.vignettingBlur.get = function () {
        return this.uniforms.vignettingBlur;
    };

    Object.defineProperties( OldFilmFilter.prototype, prototypeAccessors );

    return OldFilmFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-outline - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-outline is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$20 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$20 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec2 thickness;\r\nuniform vec4 outlineColor;\r\nuniform vec4 filterClamp;\r\n\r\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\r\n\r\nvoid main(void) {\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float maxAlpha = 0.;\r\n    vec2 displaced;\r\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\r\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\r\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\r\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\r\n        maxAlpha = max(maxAlpha, curColor.a);\r\n    }\r\n    float resultAlpha = max(maxAlpha, ownColor.a);\r\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\r\n}\r\n";

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/outline.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [thickness=1] The tickness of the outline. Make it 2 times more for resolution 2
 * @param {number} [color=0x000000] The color of the outline.
 * @param {number} [quality=0.1] The quality of the outline from `0` to `1`, using a higher quality
 *        setting will result in slower performance and more accuracy.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(9, 0xFF0000);
 */
var OutlineFilter = (function (superclass) {
    function OutlineFilter(thickness, color, quality) {
        if ( thickness === void 0 ) { thickness = 1; }
        if ( color === void 0 ) { color = 0x000000; }
        if ( quality === void 0 ) { quality = 0.1; }

        var samples =  Math.max(
            quality * OutlineFilter.MAX_SAMPLES,
            OutlineFilter.MIN_SAMPLES
        );
        var angleStep = (Math.PI * 2 / samples).toFixed(7);

        superclass.call(this, vertex$20, fragment$20.replace(/\$\{angleStep\}/, angleStep));
        this.uniforms.thickness = new Float32Array([0, 0]);

        /**
         * The thickness of the outline.
         * @member {number}
         * @default 1
         */
        this.thickness = thickness;

        this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
        this.color = color;

        this.quality = quality;
    }

    if ( superclass ) { OutlineFilter.__proto__ = superclass; }
    OutlineFilter.prototype = Object.create( superclass && superclass.prototype );
    OutlineFilter.prototype.constructor = OutlineFilter;

    var prototypeAccessors = { color: { configurable: true } };

    OutlineFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.thickness[0] = this.thickness / input.size.width;
        this.uniforms.thickness[1] = this.thickness / input.size.height;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * The color of the glow.
     * @member {number}
     * @default 0x000000
     */
    prototypeAccessors.color.get = function () {
        return pixi_js.utils.rgb2hex(this.uniforms.outlineColor);
    };
    prototypeAccessors.color.set = function (value) {
        pixi_js.utils.hex2rgb(value, this.uniforms.outlineColor);
    };

    Object.defineProperties( OutlineFilter.prototype, prototypeAccessors );

    return OutlineFilter;
}(pixi_js.Filter));

/**
 * The minimum number of samples for rendering outline.
 * @static
 * @member {number} MIN_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 1
 */
OutlineFilter.MIN_SAMPLES = 1;

/**
 * The maximum number of samples for rendering outline.
 * @static
 * @member {number} MAX_SAMPLES
 * @memberof PIXI.filters.OutlineFilter
 * @default 100
 */
OutlineFilter.MAX_SAMPLES = 100;

/*!
 * @pixi/filter-pixelate - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-pixelate is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$21 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$21 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform vec2 size;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\n\r\nvec2 mapCoord( vec2 coord )\r\n{\r\n    coord *= filterArea.xy;\r\n    coord += filterArea.zw;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 unmapCoord( vec2 coord )\r\n{\r\n    coord -= filterArea.zw;\r\n    coord /= filterArea.xy;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 pixelate(vec2 coord, vec2 size)\r\n{\r\n\treturn floor( coord / size ) * size;\r\n}\r\n\r\nvoid main(void)\r\n{\r\n    vec2 coord = mapCoord(vTextureCoord);\r\n\r\n    coord = pixelate(coord, size);\r\n\r\n    coord = unmapCoord(coord);\r\n\r\n    gl_FragColor = texture2D(uSampler, coord);\r\n}\r\n";

/**
 * This filter applies a pixelate effect making display objects appear 'blocky'.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/pixelate.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point|Array<number>|number} [size=10] Either the width/height of the size of the pixels, or square size
 */
var PixelateFilter = (function (superclass) {
    function PixelateFilter(size) {
        if ( size === void 0 ) { size = 10; }

        superclass.call(this, vertex$21, fragment$21);
        this.size = size;
    }

    if ( superclass ) { PixelateFilter.__proto__ = superclass; }
    PixelateFilter.prototype = Object.create( superclass && superclass.prototype );
    PixelateFilter.prototype.constructor = PixelateFilter;

    var prototypeAccessors = { size: { configurable: true } };

    /**
     * This a point that describes the size of the blocks.
     * x is the width of the block and y is the height.
     *
     * @member {PIXI.Point|Array<number>|number}
     * @default 10
     */
    prototypeAccessors.size.get = function () {
        return this.uniforms.size;
    };
    prototypeAccessors.size.set = function (value) {
        if (typeof value === 'number') {
            value = [value, value];
        }
        this.uniforms.size = value;
    };

    Object.defineProperties( PixelateFilter.prototype, prototypeAccessors );

    return PixelateFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-radial-blur - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-radial-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$22 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$22 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\n\r\nuniform float uRadian;\r\nuniform vec2 uCenter;\r\nuniform float uRadius;\r\nuniform int uKernelSize;\r\n\r\nconst int MAX_KERNEL_SIZE = 2048;\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = texture2D(uSampler, vTextureCoord);\r\n\r\n    if (uKernelSize == 0)\r\n    {\r\n        gl_FragColor = color;\r\n        return;\r\n    }\r\n\r\n    float aspect = filterArea.y / filterArea.x;\r\n    vec2 center = uCenter.xy / filterArea.xy;\r\n    float gradient = uRadius / filterArea.x * 0.3;\r\n    float radius = uRadius / filterArea.x - gradient * 0.5;\r\n    int k = uKernelSize - 1;\r\n\r\n    vec2 coord = vTextureCoord;\r\n    vec2 dir = vec2(center - coord);\r\n    float dist = length(vec2(dir.x, dir.y * aspect));\r\n\r\n    float radianStep = uRadian;\r\n    if (radius >= 0.0 && dist > radius) {\r\n        float delta = dist - radius;\r\n        float gap = gradient;\r\n        float scale = 1.0 - abs(delta / gap);\r\n        if (scale <= 0.0) {\r\n            gl_FragColor = color;\r\n            return;\r\n        }\r\n        radianStep *= scale;\r\n    }\r\n    radianStep /= float(k);\r\n\r\n    float s = sin(radianStep);\r\n    float c = cos(radianStep);\r\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\r\n\r\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\r\n        if (i == k) {\r\n            break;\r\n        }\r\n\r\n        coord -= center;\r\n        coord.y *= aspect;\r\n        coord = rotationMatrix * coord;\r\n        coord.y /= aspect;\r\n        coord += center;\r\n\r\n        vec4 sample = texture2D(uSampler, coord);\r\n\r\n        // switch to pre-multiplied alpha to correctly blur transparent images\r\n        // sample.rgb *= sample.a;\r\n\r\n        color += sample;\r\n    }\r\n\r\n    gl_FragColor = color / float(uKernelSize);\r\n}\r\n";

/**
 * The RadialBlurFilter applies a Motion blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/radial-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [angle=0] Sets the angle of the motion for blur effect.
 * @param {PIXI.Point|number[]} [center=[0,0]] The center of the radial.
 * @param {number} [kernelSize=5] - The kernelSize of the blur filter. But be odd number >= 3
 * @param {number} [radius=-1] - The maximum size of the blur radius, `-1` is infinite
 */
var RadialBlurFilter = (function (superclass) {
    function RadialBlurFilter(angle, center, kernelSize, radius) {
        if ( angle === void 0 ) { angle = 0; }
        if ( center === void 0 ) { center = [0, 0]; }
        if ( kernelSize === void 0 ) { kernelSize = 5; }
        if ( radius === void 0 ) { radius = -1; }

        superclass.call(this, vertex$22, fragment$22);

        this._angle = 0;
        this.angle = angle;
        this.center = center;
        this.kernelSize = kernelSize;
        this.radius = radius;
    }

    if ( superclass ) { RadialBlurFilter.__proto__ = superclass; }
    RadialBlurFilter.prototype = Object.create( superclass && superclass.prototype );
    RadialBlurFilter.prototype.constructor = RadialBlurFilter;

    var prototypeAccessors = { angle: { configurable: true },center: { configurable: true },radius: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    RadialBlurFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.uKernelSize = this._angle !== 0 ? this.kernelSize : 0;
        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * Sets the angle in degrees of the motion for blur effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    prototypeAccessors.angle.set = function (value) {
        this._angle = value;
        this.uniforms.uRadian = value * Math.PI / 180;
    };

    prototypeAccessors.angle.get = function () {
        return this._angle;
    };

    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.uCenter;
    };

    prototypeAccessors.center.set = function (value) {
        this.uniforms.uCenter = value;
    };

    /**
     * Outer radius of the effect. The default value of `-1` is infinite.
     *
     * @member {number}
     * @default -1
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.uRadius;
    };

    prototypeAccessors.radius.set = function (value) {
        if (value < 0 || value === Infinity) {
            value = -1;
        }
        this.uniforms.uRadius = value;
    };

    Object.defineProperties( RadialBlurFilter.prototype, prototypeAccessors );

    return RadialBlurFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-reflection - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-reflection is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$23 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$23 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\nuniform vec2 dimensions;\r\n\r\nuniform bool mirror;\r\nuniform float boundary;\r\nuniform vec2 amplitude;\r\nuniform vec2 waveLength;\r\nuniform vec2 alpha;\r\nuniform float time;\r\n\r\nfloat rand(vec2 co) {\r\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\r\n}\r\n\r\nvoid main(void)\r\n{\r\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\r\n    vec2 coord = pixelCoord / dimensions;\r\n\r\n    if (coord.y < boundary) {\r\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n        return;\r\n    }\r\n\r\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\r\n    float areaY = boundary * dimensions.y / filterArea.y;\r\n    float v = areaY + areaY - vTextureCoord.y;\r\n    float y = mirror ? v : vTextureCoord.y;\r\n\r\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\r\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\r\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\r\n\r\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\r\n    x = clamp(x, filterClamp.x, filterClamp.z);\r\n\r\n    vec4 color = texture2D(uSampler, vec2(x, y));\r\n\r\n    gl_FragColor = color * _alpha;\r\n}\r\n";

/**
 * Applies a reflection effect to simulate the reflection on water with waves.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/reflection.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object} [options] - The optional parameters of Reflection effect.
 * @param {number} [options.mirror=true] - `true` to reflect the image, `false` for waves-only
 * @param {number} [options.boundary=0.5] - Vertical position of the reflection point, default is 50% (middle)
 *                 smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
 * @param {number} [options.amplitude=[0, 20]] - Starting and ending amplitude of waves
 * @param {number} [options.waveLength=[30, 100]] - Starting and ending length of waves
 * @param {number} [options.alpha=[1, 1]] - Starting and ending alpha values
 * @param {number} [options.time=0] - Time for animating position of waves
 */
var ReflectionFilter = (function (superclass) {
    function ReflectionFilter(options) {
        superclass.call(this, vertex$23, fragment$23);
        this.uniforms.amplitude = new Float32Array(2);
        this.uniforms.waveLength = new Float32Array(2);
        this.uniforms.alpha = new Float32Array(2);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            mirror: true,
            boundary: 0.5,
            amplitude: [0, 20],
            waveLength: [30, 100],
            alpha: [1, 1],

            /**
             * Time for animating position of waves
             *
             * @member {number}
             * @memberof PIXI.filters.ReflectionFilter#
             * @default 0
             */
            time: 0,
        }, options);
    }

    if ( superclass ) { ReflectionFilter.__proto__ = superclass; }
    ReflectionFilter.prototype = Object.create( superclass && superclass.prototype );
    ReflectionFilter.prototype.constructor = ReflectionFilter;

    var prototypeAccessors = { mirror: { configurable: true },boundary: { configurable: true },amplitude: { configurable: true },waveLength: { configurable: true },alpha: { configurable: true } };

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    ReflectionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * `true` to reflect the image, `false` for waves-only
     *
     * @member {boolean}
     * @default true
     */
    prototypeAccessors.mirror.set = function (value) {
        this.uniforms.mirror = value;
    };
    prototypeAccessors.mirror.get = function () {
        return this.uniforms.mirror;
    };

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     *
     * @member {number}
     * @default 0.5
     */
    prototypeAccessors.boundary.set = function (value) {
        this.uniforms.boundary = value;
    };
    prototypeAccessors.boundary.get = function () {
        return this.uniforms.boundary;
    };

    /**
     * Starting and ending amplitude of waves
     * @member {number[]}
     * @default [0, 20]
     */
    prototypeAccessors.amplitude.set = function (value) {
        this.uniforms.amplitude[0] = value[0];
        this.uniforms.amplitude[1] = value[1];
    };
    prototypeAccessors.amplitude.get = function () {
        return this.uniforms.amplitude;
    };

    /**
     * Starting and ending length of waves
     * @member {number[]}
     * @default [30, 100]
     */
    prototypeAccessors.waveLength.set = function (value) {
        this.uniforms.waveLength[0] = value[0];
        this.uniforms.waveLength[1] = value[1];
    };
    prototypeAccessors.waveLength.get = function () {
        return this.uniforms.waveLength;
    };

    /**
     * Starting and ending alpha values
     * @member {number[]}
     * @default [1, 1]
     */
    prototypeAccessors.alpha.set = function (value) {
        this.uniforms.alpha[0] = value[0];
        this.uniforms.alpha[1] = value[1];
    };
    prototypeAccessors.alpha.get = function () {
        return this.uniforms.alpha;
    };

    Object.defineProperties( ReflectionFilter.prototype, prototypeAccessors );

    return ReflectionFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-rgb-split - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$24 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$24 = "precision mediump float;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\nuniform vec2 red;\r\nuniform vec2 green;\r\nuniform vec2 blue;\r\n\r\nvoid main(void)\r\n{\r\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\r\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\r\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\r\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\r\n}\r\n";

/**
 * An RGB Split Filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/rgb.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {PIXI.Point} [red=[-10,0]] Red channel offset
 * @param {PIXI.Point} [green=[0, 10]] Green channel offset
 * @param {PIXI.Point} [blue=[0, 0]] Blue channel offset
 */
var RGBSplitFilter = (function (superclass) {
    function RGBSplitFilter(red, green, blue) {
        if ( red === void 0 ) { red = [-10, 0]; }
        if ( green === void 0 ) { green = [0, 10]; }
        if ( blue === void 0 ) { blue = [0, 0]; }

        superclass.call(this, vertex$24, fragment$24);
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    if ( superclass ) { RGBSplitFilter.__proto__ = superclass; }
    RGBSplitFilter.prototype = Object.create( superclass && superclass.prototype );
    RGBSplitFilter.prototype.constructor = RGBSplitFilter;

    var prototypeAccessors = { red: { configurable: true },green: { configurable: true },blue: { configurable: true } };

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.red.get = function () {
        return this.uniforms.red;
    };
    prototypeAccessors.red.set = function (value) {
        this.uniforms.red = value;
    };

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.green.get = function () {
        return this.uniforms.green;
    };
    prototypeAccessors.green.set = function (value) {
        this.uniforms.green = value;
    };

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.blue.get = function () {
        return this.uniforms.blue;
    };
    prototypeAccessors.blue.set = function (value) {
        this.uniforms.blue = value;
    };

    Object.defineProperties( RGBSplitFilter.prototype, prototypeAccessors );

    return RGBSplitFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-shockwave - v2.6.1
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-shockwave is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$25 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$25 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\nuniform vec4 filterClamp;\r\n\r\nuniform vec2 center;\r\n\r\nuniform float amplitude;\r\nuniform float wavelength;\r\n// uniform float power;\r\nuniform float brightness;\r\nuniform float speed;\r\nuniform float radius;\r\n\r\nuniform float time;\r\n\r\nconst float PI = 3.14159;\r\n\r\nvoid main()\r\n{\r\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\r\n    float maxRadius = radius / filterArea.x;\r\n    float currentRadius = time * speed / filterArea.x;\r\n\r\n    float fade = 1.0;\r\n\r\n    if (maxRadius > 0.0) {\r\n        if (currentRadius > maxRadius) {\r\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n            return;\r\n        }\r\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\r\n    }\r\n\r\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\r\n    dir.y *= filterArea.y / filterArea.x;\r\n    float dist = length(dir);\r\n\r\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\r\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n        return;\r\n    }\r\n\r\n    vec2 diffUV = normalize(dir);\r\n\r\n    float diff = (dist - currentRadius) / halfWavelength;\r\n\r\n    float p = 1.0 - pow(abs(diff), 2.0);\r\n\r\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\r\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\r\n\r\n    vec2 offset = diffUV * powDiff / filterArea.xy;\r\n\r\n    // Do clamp :\r\n    vec2 coord = vTextureCoord + offset;\r\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\r\n    vec4 color = texture2D(uSampler, clampedCoord);\r\n    if (coord != clampedCoord) {\r\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\r\n    }\r\n\r\n    // No clamp :\r\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\r\n\r\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

/**
 * The ShockwaveFilter class lets you apply a shockwave effect.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/shockwave.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {PIXI.Point|number[]} [center=[0.5, 0.5]] See `center` property.
 * @param {object} [options] - The optional parameters of shockwave filter.
 * @param {number} [options.amplitude=0.5] - See `amplitude`` property.
 * @param {number} [options.wavelength=1.0] - See `wavelength` property.
 * @param {number} [options.speed=500.0] - See `speed` property.
 * @param {number} [options.brightness=8] - See `brightness` property.
 * @param {number} [options.radius=4] - See `radius` property.
 * @param {number} [time=0] - See `time` property.
 */
var ShockwaveFilter = (function (superclass) {
    function ShockwaveFilter(center, options, time) {
        if ( center === void 0 ) { center = [0.0, 0.0]; }
        if ( options === void 0 ) { options = {}; }
        if ( time === void 0 ) { time = 0; }

        superclass.call(this, vertex$25, fragment$25);

        this.center = center;

        if (Array.isArray(options)) {
            // eslint-disable-next-line no-console
            console.warn('Deprecated Warning: ShockwaveFilter params Array has been changed to options Object.');
            options = {};
        }

        options = Object.assign({
            amplitude: 30.0,
            wavelength: 160.0,
            brightness: 1.0,
            speed: 500.0,
            radius: -1.0,
        }, options);

        this.amplitude = options.amplitude;

        this.wavelength = options.wavelength;

        this.brightness = options.brightness;

        this.speed = options.speed;

        this.radius = options.radius;

        /**
         * Sets the elapsed time of the shockwave.
         * It could control the current size of shockwave.
         *
         * @member {number}
         */
        this.time = time;
    }

    if ( superclass ) { ShockwaveFilter.__proto__ = superclass; }
    ShockwaveFilter.prototype = Object.create( superclass && superclass.prototype );
    ShockwaveFilter.prototype.constructor = ShockwaveFilter;

    var prototypeAccessors = { center: { configurable: true },amplitude: { configurable: true },wavelength: { configurable: true },brightness: { configurable: true },speed: { configurable: true },radius: { configurable: true } };

    ShockwaveFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        /**
         * There is no set/get of `time`, for performance.
         * Because in the most real cases, `time` will be changed in ever game tick.
         * Use set/get will take more function-call.
         */
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    };

    /**
     * Sets the center of the shockwave in normalized screen coords. That is
     * (0,0) is the top-left and (1,1) is the bottom right.
     *
     * @member {PIXI.Point|number[]}
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.center;
    };
    prototypeAccessors.center.set = function (value) {
        this.uniforms.center = value;
    };

    /**
     * The amplitude of the shockwave.
     *
     * @member {number}
     */
    prototypeAccessors.amplitude.get = function () {
        return this.uniforms.amplitude;
    };
    prototypeAccessors.amplitude.set = function (value) {
        this.uniforms.amplitude = value;
    };

    /**
     * The wavelength of the shockwave.
     *
     * @member {number}
     */
    prototypeAccessors.wavelength.get = function () {
        return this.uniforms.wavelength;
    };
    prototypeAccessors.wavelength.set = function (value) {
        this.uniforms.wavelength = value;
    };

    /**
     * The brightness of the shockwave.
     *
     * @member {number}
     */
    prototypeAccessors.brightness.get = function () {
        return this.uniforms.brightness;
    };
    prototypeAccessors.brightness.set = function (value) {
        this.uniforms.brightness = value;
    };

    /**
     * The speed about the shockwave ripples out.
     * The unit is `pixel/second`
     *
     * @member {number}
     */
    prototypeAccessors.speed.get = function () {
        return this.uniforms.speed;
    };
    prototypeAccessors.speed.set = function (value) {
        this.uniforms.speed = value;
    };

    /**
     * The maximum radius of shockwave.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.radius;
    };
    prototypeAccessors.radius.set = function (value) {
        this.uniforms.radius = value;
    };

    Object.defineProperties( ShockwaveFilter.prototype, prototypeAccessors );

    return ShockwaveFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-simple-lightmap - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-simple-lightmap is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$26 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$26 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform sampler2D uLightmap;\r\nuniform vec4 filterArea;\r\nuniform vec2 dimensions;\r\nuniform vec4 ambientColor;\r\nvoid main() {\r\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\r\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\r\n    vec4 light = texture2D(uLightmap, lightCoord);\r\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\r\n    vec3 intensity = ambient + light.rgb;\r\n    vec3 finalColor = diffuseColor.rgb * intensity;\r\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\r\n}\r\n";

/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* You have to specify filterArea, or suffer consequences.
* You may have to use it with `filter.dontFit = true`,
*  until we rewrite this using same approach as for DisplacementFilter.
*
* ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/simple-lightmap.png)
* @class
* @extends PIXI.Filter
* @memberof PIXI.filters
* @param {PIXI.Texture} texture a texture where your lightmap is rendered
* @param {Array<number>|number} [color=0x000000] An RGBA array of the ambient color
* @param {number} [alpha=1] Default alpha set independent of color (if it's a number, not array).
*
* @example
*  displayObject.filters = [new SimpleLightmapFilter(texture, 0x666666)];
*/
var SimpleLightmapFilter = (function (superclass) {
    function SimpleLightmapFilter(texture, color, alpha) {
        if ( color === void 0 ) { color = 0x000000; }
        if ( alpha === void 0 ) { alpha = 1; }

        superclass.call(this, vertex$26, fragment$26);
        this.uniforms.dimensions = new Float32Array(2);
        this.uniforms.ambientColor = new Float32Array([0, 0, 0, alpha]);
        this.texture = texture;
        this.color = color;
    }

    if ( superclass ) { SimpleLightmapFilter.__proto__ = superclass; }
    SimpleLightmapFilter.prototype = Object.create( superclass && superclass.prototype );
    SimpleLightmapFilter.prototype.constructor = SimpleLightmapFilter;

    var prototypeAccessors = { texture: { configurable: true },color: { configurable: true },alpha: { configurable: true } };

    /**
     * Applies the filter.
     * @private
     * @param {PIXI.FilterManager} filterManager - The manager.
     * @param {PIXI.RenderTarget} input - The input target.
     * @param {PIXI.RenderTarget} output - The output target.
     */
    SimpleLightmapFilter.prototype.apply = function apply (filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    };


    /**
     * a texture where your lightmap is rendered
     * @member {PIXI.Texture}
     */
    prototypeAccessors.texture.get = function () {
        return this.uniforms.uLightmap;
    };
    prototypeAccessors.texture.set = function (value) {
        this.uniforms.uLightmap = value;
    };

    /**
     * An RGBA array of the ambient color or a hex color without alpha
     * @member {Array<number>|number}
     */
    prototypeAccessors.color.set = function (value) {
        var arr = this.uniforms.ambientColor;
        if (typeof value === 'number') {
            pixi_js.utils.hex2rgb(value, arr);
            this._color = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            arr[3] = value[3];
            this._color = pixi_js.utils.rgb2hex(arr);
        }
    };
    prototypeAccessors.color.get = function () {
        return this._color;
    };

    /**
     * When setting `color` as hex, this can be used to set alpha independently.
     * @member {number}
     */
    prototypeAccessors.alpha.get = function () {
        return this.uniforms.ambientColor[3];
    };
    prototypeAccessors.alpha.set = function (value) {
        this.uniforms.ambientColor[3] = value;
    };

    Object.defineProperties( SimpleLightmapFilter.prototype, prototypeAccessors );

    return SimpleLightmapFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-tilt-shift - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-tilt-shift is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$27 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$27 = "varying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\nuniform float blur;\r\nuniform float gradientBlur;\r\nuniform vec2 start;\r\nuniform vec2 end;\r\nuniform vec2 delta;\r\nuniform vec2 texSize;\r\n\r\nfloat random(vec3 scale, float seed)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\r\n}\r\n\r\nvoid main(void)\r\n{\r\n    vec4 color = vec4(0.0);\r\n    float total = 0.0;\r\n\r\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\r\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\r\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\r\n\r\n    for (float t = -30.0; t <= 30.0; t++)\r\n    {\r\n        float percent = (t + offset - 0.5) / 30.0;\r\n        float weight = 1.0 - abs(percent);\r\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\r\n        sample.rgb *= sample.a;\r\n        color += sample * weight;\r\n        total += weight;\r\n    }\r\n\r\n    color /= total;\r\n    color.rgb /= color.a + 0.00001;\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftAxisFilter.
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftAxisFilter = (function (superclass) {
    function TiltShiftAxisFilter(blur, gradientBlur, start, end){
        if ( blur === void 0 ) { blur = 100; }
        if ( gradientBlur === void 0 ) { gradientBlur = 600; }
        if ( start === void 0 ) { start = null; }
        if ( end === void 0 ) { end = null; }

        superclass.call(this, vertex$27, fragment$27);
        this.uniforms.blur = blur;
        this.uniforms.gradientBlur = gradientBlur;
        this.uniforms.start = start || new pixi_js.Point(0, window.innerHeight / 2);
        this.uniforms.end = end || new pixi_js.Point(600, window.innerHeight / 2);
        this.uniforms.delta = new pixi_js.Point(30, 30);
        this.uniforms.texSize = new pixi_js.Point(window.innerWidth, window.innerHeight);
        this.updateDelta();
    }

    if ( superclass ) { TiltShiftAxisFilter.__proto__ = superclass; }
    TiltShiftAxisFilter.prototype = Object.create( superclass && superclass.prototype );
    TiltShiftAxisFilter.prototype.constructor = TiltShiftAxisFilter;

    var prototypeAccessors = { blur: { configurable: true },gradientBlur: { configurable: true },start: { configurable: true },end: { configurable: true } };

    /**
     * Updates the filter delta values.
     * This is overridden in the X and Y filters, does nothing for this class.
     *
     */
    TiltShiftAxisFilter.prototype.updateDelta = function updateDelta () {
        this.uniforms.delta.x = 0;
        this.uniforms.delta.y = 0;
    };

    /**
     * The strength of the blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.blur.get = function () {
        return this.uniforms.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.uniforms.blur = value;
    };

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.gradientBlur.get = function () {
        return this.uniforms.gradientBlur;
    };
    prototypeAccessors.gradientBlur.set = function (value) {
        this.uniforms.gradientBlur = value;
    };

    /**
     * The X value to start the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.start.get = function () {
        return this.uniforms.start;
    };
    prototypeAccessors.start.set = function (value) {
        this.uniforms.start = value;
        this.updateDelta();
    };

    /**
     * The X value to end the effect at.
     *
     * @member {PIXI.Point}
     * @memberof PIXI.filters.TiltShiftAxisFilter#
     */
    prototypeAccessors.end.get = function () {
        return this.uniforms.end;
    };
    prototypeAccessors.end.set = function (value) {
        this.uniforms.end = value;
        this.updateDelta();
    };

    Object.defineProperties( TiltShiftAxisFilter.prototype, prototypeAccessors );

    return TiltShiftAxisFilter;
}(pixi_js.Filter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftXFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftXFilter = (function (TiltShiftAxisFilter$$1) {
    function TiltShiftXFilter () {
        TiltShiftAxisFilter$$1.apply(this, arguments);
    }

    if ( TiltShiftAxisFilter$$1 ) { TiltShiftXFilter.__proto__ = TiltShiftAxisFilter$$1; }
    TiltShiftXFilter.prototype = Object.create( TiltShiftAxisFilter$$1 && TiltShiftAxisFilter$$1.prototype );
    TiltShiftXFilter.prototype.constructor = TiltShiftXFilter;

    TiltShiftXFilter.prototype.updateDelta = function updateDelta () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        this.uniforms.delta.x = dx / d;
        this.uniforms.delta.y = dy / d;
    };

    return TiltShiftXFilter;
}(TiltShiftAxisFilter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShiftYFilter.
 *
 * @class
 * @extends PIXI.TiltShiftAxisFilter
 * @memberof PIXI.filters
 * @private
 */
var TiltShiftYFilter = (function (TiltShiftAxisFilter$$1) {
    function TiltShiftYFilter () {
        TiltShiftAxisFilter$$1.apply(this, arguments);
    }

    if ( TiltShiftAxisFilter$$1 ) { TiltShiftYFilter.__proto__ = TiltShiftAxisFilter$$1; }
    TiltShiftYFilter.prototype = Object.create( TiltShiftAxisFilter$$1 && TiltShiftAxisFilter$$1.prototype );
    TiltShiftYFilter.prototype.constructor = TiltShiftYFilter;

    TiltShiftYFilter.prototype.updateDelta = function updateDelta () {
        var dx = this.uniforms.end.x - this.uniforms.start.x;
        var dy = this.uniforms.end.y - this.uniforms.start.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        this.uniforms.delta.x = -dy / d;
        this.uniforms.delta.y = dx / d;
    };

    return TiltShiftYFilter;
}(TiltShiftAxisFilter));

/**
 * @author Vico @vicocotea
 * original filter https://github.com/evanw/glfx.js/blob/master/src/filters/blur/tiltshift.js by Evan Wallace : http://madebyevan.com/
 */

/**
 * A TiltShift Filter. Manages the pass of both a TiltShiftXFilter and TiltShiftYFilter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/tilt-shift.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [blur=100] The strength of the blur.
 * @param {number} [gradientBlur=600] The strength of the gradient blur.
 * @param {PIXI.Point} [start=null] The Y value to start the effect at.
 * @param {PIXI.Point} [end=null] The Y value to end the effect at.
 */
var TiltShiftFilter = (function (superclass) {
    function TiltShiftFilter(blur, gradientBlur, start, end) {
        if ( blur === void 0 ) { blur = 100; }
        if ( gradientBlur === void 0 ) { gradientBlur = 600; }
        if ( start === void 0 ) { start = null; }
        if ( end === void 0 ) { end = null; }

        superclass.call(this);
        this.tiltShiftXFilter = new TiltShiftXFilter(blur, gradientBlur, start, end);
        this.tiltShiftYFilter = new TiltShiftYFilter(blur, gradientBlur, start, end);
    }

    if ( superclass ) { TiltShiftFilter.__proto__ = superclass; }
    TiltShiftFilter.prototype = Object.create( superclass && superclass.prototype );
    TiltShiftFilter.prototype.constructor = TiltShiftFilter;

    var prototypeAccessors = { blur: { configurable: true },gradientBlur: { configurable: true },start: { configurable: true },end: { configurable: true } };

    TiltShiftFilter.prototype.apply = function apply (filterManager, input, output) {
        var renderTarget = filterManager.getRenderTarget(true);
        this.tiltShiftXFilter.apply(filterManager, input, renderTarget);
        this.tiltShiftYFilter.apply(filterManager, renderTarget, output);
        filterManager.returnRenderTarget(renderTarget);
    };

    /**
     * The strength of the blur.
     *
     * @member {number}
     */
    prototypeAccessors.blur.get = function () {
        return this.tiltShiftXFilter.blur;
    };
    prototypeAccessors.blur.set = function (value) {
        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = value;
    };

    /**
     * The strength of the gradient blur.
     *
     * @member {number}
     */
    prototypeAccessors.gradientBlur.get = function () {
        return this.tiltShiftXFilter.gradientBlur;
    };
    prototypeAccessors.gradientBlur.set = function (value) {
        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = value;
    };

    /**
     * The Y value to start the effect at.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.start.get = function () {
        return this.tiltShiftXFilter.start;
    };
    prototypeAccessors.start.set = function (value) {
        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = value;
    };

    /**
     * The Y value to end the effect at.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.end.get = function () {
        return this.tiltShiftXFilter.end;
    };
    prototypeAccessors.end.set = function (value) {
        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = value;
    };

    Object.defineProperties( TiltShiftFilter.prototype, prototypeAccessors );

    return TiltShiftFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-twist - v2.5.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-twist is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$28 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$28 = "varying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\nuniform float radius;\r\nuniform float angle;\r\nuniform vec2 offset;\r\nuniform vec4 filterArea;\r\n\r\nvec2 mapCoord( vec2 coord )\r\n{\r\n    coord *= filterArea.xy;\r\n    coord += filterArea.zw;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 unmapCoord( vec2 coord )\r\n{\r\n    coord -= filterArea.zw;\r\n    coord /= filterArea.xy;\r\n\r\n    return coord;\r\n}\r\n\r\nvec2 twist(vec2 coord)\r\n{\r\n    coord -= offset;\r\n\r\n    float dist = length(coord);\r\n\r\n    if (dist < radius)\r\n    {\r\n        float ratioDist = (radius - dist) / radius;\r\n        float angleMod = ratioDist * ratioDist * angle;\r\n        float s = sin(angleMod);\r\n        float c = cos(angleMod);\r\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\r\n    }\r\n\r\n    coord += offset;\r\n\r\n    return coord;\r\n}\r\n\r\nvoid main(void)\r\n{\r\n\r\n    vec2 coord = mapCoord(vTextureCoord);\r\n\r\n    coord = twist(coord);\r\n\r\n    coord = unmapCoord(coord);\r\n\r\n    gl_FragColor = texture2D(uSampler, coord );\r\n\r\n}\r\n";

/**
 * This filter applies a twist effect making display objects appear twisted in the given direction.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/twist.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [radius=200] The radius of the twist.
 * @param {number} [angle=4] The angle of the twist.
 * @param {number} [padding=20] Padding for filter area.
 */
var TwistFilter = (function (superclass) {
    function TwistFilter(radius, angle, padding) {
        if ( radius === void 0 ) { radius = 200; }
        if ( angle === void 0 ) { angle = 4; }
        if ( padding === void 0 ) { padding = 20; }

        superclass.call(this, vertex$28, fragment$28);

        this.radius = radius;
        this.angle = angle;
        this.padding = padding;
    }

    if ( superclass ) { TwistFilter.__proto__ = superclass; }
    TwistFilter.prototype = Object.create( superclass && superclass.prototype );
    TwistFilter.prototype.constructor = TwistFilter;

    var prototypeAccessors = { offset: { configurable: true },radius: { configurable: true },angle: { configurable: true } };

    /**
     * This point describes the the offset of the twist.
     *
     * @member {PIXI.Point}
     */
    prototypeAccessors.offset.get = function () {
        return this.uniforms.offset;
    };
    prototypeAccessors.offset.set = function (value) {
        this.uniforms.offset = value;
    };

    /**
     * The radius of the twist.
     *
     * @member {number}
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.radius;
    };
    prototypeAccessors.radius.set = function (value) {
        this.uniforms.radius = value;
    };

    /**
     * The angle of the twist.
     *
     * @member {number}
     */
    prototypeAccessors.angle.get = function () {
        return this.uniforms.angle;
    };
    prototypeAccessors.angle.set = function (value) {
        this.uniforms.angle = value;
    };

    Object.defineProperties( TwistFilter.prototype, prototypeAccessors );

    return TwistFilter;
}(pixi_js.Filter));

/*!
 * @pixi/filter-zoom-blur - v2.6.0
 * Compiled Mon, 13 Aug 2018 18:40:35 UTC
 *
 * @pixi/filter-zoom-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */

var vertex$29 = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n    vTextureCoord = aTextureCoord;\r\n}";

var fragment$29 = "varying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\nuniform vec4 filterArea;\r\n\r\nuniform vec2 uCenter;\r\nuniform float uStrength;\r\nuniform float uInnerRadius;\r\nuniform float uRadius;\r\n\r\nconst float MAX_KERNEL_SIZE = 32.0;\r\n\r\nfloat random(vec3 scale, float seed) {\r\n    // use the fragment position for a different seed per-pixel\r\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\r\n}\r\n\r\nvoid main() {\r\n\r\n    float minGradient = uInnerRadius * 0.3;\r\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\r\n\r\n    float gradient = uRadius * 0.3;\r\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\r\n\r\n    float countLimit = MAX_KERNEL_SIZE;\r\n\r\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\r\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\r\n\r\n    float strength = uStrength;\r\n\r\n    float delta = 0.0;\r\n    float gap;\r\n    if (dist < innerRadius) {\r\n        delta = innerRadius - dist;\r\n        gap = minGradient;\r\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\r\n        delta = dist - radius;\r\n        gap = gradient;\r\n    }\r\n\r\n    if (delta > 0.0) {\r\n        float normalCount = gap / filterArea.x;\r\n        delta = (normalCount - delta) / normalCount;\r\n        countLimit *= delta;\r\n        strength *= delta;\r\n        if (countLimit < 1.0)\r\n        {\r\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\r\n            return;\r\n        }\r\n    }\r\n\r\n    // randomize the lookup values to hide the fixed number of samples\r\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\r\n\r\n    float total = 0.0;\r\n    vec4 color = vec4(0.0);\r\n\r\n    dir *= strength;\r\n\r\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\r\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\r\n        float weight = 4.0 * (percent - percent * percent);\r\n        vec2 p = vTextureCoord + dir * percent;\r\n        vec4 sample = texture2D(uSampler, p);\r\n\r\n        // switch to pre-multiplied alpha to correctly blur transparent images\r\n        // sample.rgb *= sample.a;\r\n\r\n        color += sample * weight;\r\n        total += weight;\r\n\r\n        if (t > countLimit){\r\n            break;\r\n        }\r\n    }\r\n\r\n    color /= total;\r\n    // switch back from pre-multiplied alpha\r\n    color.rgb /= color.a + 0.00001;\r\n\r\n    gl_FragColor = color;\r\n}\r\n";

/**
 * The ZoomFilter applies a Zoom blur to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/zoom-blur.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=0.1] Sets the strength of the zoom blur effect
 * @param {PIXI.Point|number[]} [center=[0,0]] The center of the zoom.
 * @param {number} [innerRadius=0] The inner radius of zoom. The part in inner circle won't apply zoom blur effect.
 * @param {number} [radius=-1] See `radius` property.
 */
var ZoomBlurFilter = (function (superclass) {
    function ZoomBlurFilter(strength, center, innerRadius, radius) {
        if ( strength === void 0 ) { strength = 0.1; }
        if ( center === void 0 ) { center = [0, 0]; }
        if ( innerRadius === void 0 ) { innerRadius = 0; }
        if ( radius === void 0 ) { radius = -1; }

        superclass.call(this, vertex$29, fragment$29);

        this.center = center;
        this.strength = strength;
        this.innerRadius = innerRadius;
        this.radius = radius;
    }

    if ( superclass ) { ZoomBlurFilter.__proto__ = superclass; }
    ZoomBlurFilter.prototype = Object.create( superclass && superclass.prototype );
    ZoomBlurFilter.prototype.constructor = ZoomBlurFilter;

    var prototypeAccessors = { center: { configurable: true },strength: { configurable: true },innerRadius: { configurable: true },radius: { configurable: true } };

    /**
     * Center of the effect.
     *
     * @member {PIXI.Point|number[]}
     * @default [0, 0]
     */
    prototypeAccessors.center.get = function () {
        return this.uniforms.uCenter;
    };
    prototypeAccessors.center.set = function (value) {
        this.uniforms.uCenter = value;
    };

    /**
     * Intensity of the zoom effect.
     *
     * @member {number}
     * @default 0.1
     */
    prototypeAccessors.strength.get = function () {
        return this.uniforms.uStrength;
    };
    prototypeAccessors.strength.set = function (value) {
        this.uniforms.uStrength = value;
    };

    /**
     * Radius of the inner region not effected by blur.
     *
     * @member {number}
     * @default 0
     */
    prototypeAccessors.innerRadius.get = function () {
        return this.uniforms.uInnerRadius;
    };
    prototypeAccessors.innerRadius.set = function (value) {
        this.uniforms.uInnerRadius = value;
    };

    /**
     * Outer radius of the effect. The default value is `-1`.
     * `< 0.0` means it's infinity.
     *
     * @member {number}
     * @default -1
     */
    prototypeAccessors.radius.get = function () {
        return this.uniforms.uRadius;
    };
    prototypeAccessors.radius.set = function (value) {
        if (value < 0 || value === Infinity) {
            value = -1;
        }
        this.uniforms.uRadius = value;
    };

    Object.defineProperties( ZoomBlurFilter.prototype, prototypeAccessors );

    return ZoomBlurFilter;
}(pixi_js.Filter));

exports.AdjustmentFilter = AdjustmentFilter;
exports.AdvancedBloomFilter = AdvancedBloomFilter;
exports.AsciiFilter = AsciiFilter;
exports.BevelFilter = BevelFilter;
exports.BloomFilter = BloomFilter;
exports.BulgePinchFilter = BulgePinchFilter;
exports.ColorMapFilter = ColorMapFilter;
exports.ColorReplaceFilter = ColorReplaceFilter;
exports.ConvolutionFilter = ConvolutionFilter;
exports.CrossHatchFilter = CrossHatchFilter;
exports.CRTFilter = CRTFilter;
exports.DotFilter = DotFilter;
exports.DropShadowFilter = DropShadowFilter;
exports.EmbossFilter = EmbossFilter;
exports.GlitchFilter = GlitchFilter;
exports.GlowFilter = GlowFilter;
exports.GodrayFilter = GodrayFilter;
exports.KawaseBlurFilter = KawaseBlurFilter;
exports.MotionBlurFilter = MotionBlurFilter;
exports.MultiColorReplaceFilter = MultiColorReplaceFilter;
exports.OldFilmFilter = OldFilmFilter;
exports.OutlineFilter = OutlineFilter;
exports.PixelateFilter = PixelateFilter;
exports.RadialBlurFilter = RadialBlurFilter;
exports.ReflectionFilter = ReflectionFilter;
exports.RGBSplitFilter = RGBSplitFilter;
exports.ShockwaveFilter = ShockwaveFilter;
exports.SimpleLightmapFilter = SimpleLightmapFilter;
exports.TiltShiftFilter = TiltShiftFilter;
exports.TiltShiftAxisFilter = TiltShiftAxisFilter;
exports.TiltShiftXFilter = TiltShiftXFilter;
exports.TiltShiftYFilter = TiltShiftYFilter;
exports.TwistFilter = TwistFilter;
exports.ZoomBlurFilter = ZoomBlurFilter;

return exports;

}({},PIXI));
Object.assign(PIXI.filters, this ? this.__filters : __filters);
//# sourceMappingURL=pixi-filters.js.map
