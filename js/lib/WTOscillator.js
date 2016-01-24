/**
 * Created by luketwyman on 24/01/2016.
 */

define(["Tone/core/Tone", "Tone/source/Source", "Tone/source/Oscillator", "Tone/signal/Signal", "Tone/signal/WaveShaper"],
    function(Tone){

        "use strict";

        /**
         *  @class Tone.PulseOscillator is a pulse oscillator with control over pulse width,
         *         also known as the duty cycle. At 50% duty cycle (width = 0.5) the wave is
         *         a square and only odd-numbered harmonics are present. At all other widths
         *         even-numbered harmonics are present. Read more
         *         [here](https://wigglewave.wordpress.com/2014/08/16/pulse-waveforms-and-harmonics/).
         *
         *  @constructor
         *  @extends {Tone.Oscillator}
         *  @param {Frequency} [frequency] The frequency of the oscillator
         *  @param {NormalRange} [width] The width of the pulse
         *  @example
         * var wavetable = new Tone.WTOscillator("E5", 0.4).toMaster().start();
         */
        Tone.WTOscillator = function(){

            var options = this.optionsObject(arguments, ["frequency","wavetable"], Tone.Oscillator.defaults);
            Tone.Source.call(this, options);


            /**
             *  the default table
             *
             *  @private
             */
            this._table = new Float32Array([0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8]);


            /**
             *  the oscillator
             *  @type {Tone.Oscillator}
             *  @private
             */
            this._oscillator = new Tone.Oscillator({
                frequency : options.frequency,
                detune : options.detune,
                type : "sawtooth",
                phase : options.phase
            });

            /**
             *  The frequency control.
             *  @type {Frequency}
             *  @signal
             */
            this.frequency = this._oscillator.frequency;

            /**
             *  The detune in cents.
             *  @type {Cents}
             *  @signal
             */
            this.detune = this._oscillator.detune;



            //connections
            this._oscillator.chain(this.output);
            this._readOnly(["frequency", "wavetable", "detune"]);
        };

        Tone.extend(Tone.WTOscillator, Tone.Oscillator);

        /**
         *  The default parameters.
         *  @static
         *  @const
         *  @type {Object}
         */
        Tone.WTOscillator.defaults = {
            "frequency" : 440,
            "detune" : 0,
            "phase" : 0,
            "wavetable" : this._table
        };

        /**
         *  start the oscillator
         *  @param  {Time} time
         *  @private
         */
        Tone.WTOscillator.prototype._start = function(time){
            time = this.toSeconds(time);
            this._oscillator.start(time);
        };

        /**
         *  stop the oscillator
         *  @param  {Time} time
         *  @private
         */
        Tone.WTOscillator.prototype._stop = function(time){
            time = this.toSeconds(time);
            this._oscillator.stop(time);
        };

        /**
         * The phase of the oscillator in degrees.
         * @memberOf Tone.PulseOscillator#
         * @type {Degrees}
         * @name phase
         */
        Object.defineProperty(Tone.WTOscillator.prototype, "table", {
            get : function(){
                return this._oscillator.wavetable;
            },
            set : function(table){
                var imag = new Float32Array(table.length);
                var periodicWave = this.context.createPeriodicWave(table, imag);
                this._oscillator.setPeriodicWave(periodicWave);
                this._oscillator.wavetable = table;
            }
        });

        /**
         * The phase of the oscillator in degrees.
         * @memberOf Tone.PulseOscillator#
         * @type {Degrees}
         * @name phase
         */
        Object.defineProperty(Tone.WTOscillator.prototype, "phase", {
            get : function(){
                return this._oscillator.phase;
            },
            set : function(phase){
                this._oscillator.phase = phase;
            }
        });

        /**
         * The type of the oscillator. Always returns "pulse".
         * @readOnly
         * @memberOf Tone.PulseOscillator#
         * @type {string}
         * @name type
         */
        Object.defineProperty(Tone.WTOscillator.prototype, "type", {
            get : function(){
                return "wavetable";
            }
        });

        /**
         * The partials of the waveform. Cannot set partials for this waveform type
         * @memberOf Tone.PulseOscillator#
         * @type {Array}
         * @name partials
         * @private
         */
        Object.defineProperty(Tone.WTOscillator.prototype, "partials", {
            get : function(){
                return [];
            }
        });

        /**
         *  Clean up method.
         *  @return {Tone.PulseOscillator} this
         */
        Tone.WTOscillator.prototype.dispose = function(){
            Tone.Source.prototype.dispose.call(this);
            this._oscillator.dispose();
            this._oscillator = null;
            this._writable(["frequency", "wavetable", "detune"]);
            this.frequency = null;
            this.detune = null;
            return this;
        };

        return Tone.WTOscillator;
    });