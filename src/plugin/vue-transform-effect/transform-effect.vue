<template>
    <div id="transform-js"
         :frameDuration="frameDuration"
         :duration="duration"
         :rotationSpeed="rotationSpeed"
         :maxBaseSize="maxBaseSize"
         :animationDirection="animationDirection"
         :sizeVariationRange="sizeVariationRange"
         :baseRotation="baseRotation"
         :baseSize="baseSize"
         :initColor="initColor"
         :lineWidth="lineWidth">
    </div>
</template>

<script>
    export default {
        name: "transform-effect",
        props: {
            frameDuration: {
                type: Number,
                default: 1000 / 60,
            },
            duration: {
                type: Number,
                default: 5000,
            },
            rotationSpeed: {
                type: Number,
                default: .3,
            },
            maxBaseSize: {
                type: Number,
                default: 100,
            },
            animationDirection: {
                type: Number,
                default: 1,
            },
            sizeVariationRange: {
                type: Number,
                default: .1,
            },
            baseRotation: {
                type: Number,
                default: 0,
            },
            baseSize: {
                type: Number,
                default: 20,
            },
            initColor: {
                type: String,
                default: '#bc5478',
            },
            lineWidth: {
                type: Number,
                default: 1,
            }
        },
        mounted() {
            const transformEffect = require('./TransformEffect.min');
            const {
                frameDuration,
                duration,
                rotationSpeed,
                maxBaseSize,
                animationDirection,
                sizeVariationRange,
                baseRotation,
                baseSize,
                initColor,
                lineWidth,
            } = this;
            this.$nextTick(transformEffect('transform-js', {
                frameDuration,
                duration,
                rotationSpeed,
                maxBaseSize,
                animationDirection,
                sizeVariationRange,
                baseRotation,
                baseSize,
                initColor,
                lineWidth,
            }))
        }
    }
</script>

<style scoped>
    #transform-js {
        position: fixed;
    }
</style>