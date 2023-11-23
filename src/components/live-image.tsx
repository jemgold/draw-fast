/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  FrameShapeUtil,
  getSvgAsImage,
  HTMLContainer,
  TLEventMapHandler,
  TLFrameShape,
  TLShape,
  useEditor,
} from "@tldraw/tldraw";

import { blobToDataUri } from "@/utils/blob";
import { debounce } from "@/utils/debounce";
import * as fal from "@fal-ai/serverless-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import result from "postcss/lib/result";
import { useLiveImage } from "@/hooks/useLiveImage";

type Input = {
  prompt: string;
  image_url: string;
  sync_mode: boolean;
  seed: number;
  strength?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
  enable_safety_checks?: boolean;
};

type Output = {
  images: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  seed: number;
  num_inference_steps: number;
};

export class LiveImageShapeUtil extends FrameShapeUtil {
  static override type = "live-image" as any;

  override getDefaultProps(): { w: number; h: number; name: string } {
    return {
      w: 512,
      h: 512,
      name: "a city skyline",
    };
  }

  override component(shape: TLFrameShape) {
    const component = super.component(shape);
    const editor = useEditor();

    const { image, onDrawingChange } = useLiveImage({
      // prompt: prompt,
      seed: 111111,
      strength: 0.7,
      shape,
    });

    const { image: image2, onDrawingChange: onDrawingChange2 } = useLiveImage({
      // prompt: prompt,
      seed: 333333,
      strength: 0.7,
      shape,
    });

    const { image: image3, onDrawingChange: onDrawingChange3 } = useLiveImage({
      // prompt: prompt,
      seed: 555555,
      strength: 0.7,
      shape,
    });

    const { image: image4, onDrawingChange: onDrawingChange4 } = useLiveImage({
      // prompt: prompt,
      seed: 777777,
      strength: 0.7,
      shape,
    });

    useEffect(() => {
      // TODO: be more efficient - only update when the shapes change, not the pointer
      const onChange: TLEventMapHandler<"change"> = (event) => {
        if (event.source !== "user") {
          return;
        }
        if (
          Object.keys(event.changes.added).length ||
          Object.keys(event.changes.removed).length ||
          Object.keys(event.changes.updated).length
        ) {
          onDrawingChange();
          onDrawingChange2();
          onDrawingChange3();
          onDrawingChange4();
        }
      };

      editor.addListener("change", onChange);
      return () => {
        editor.removeListener("change", onChange);
      };
    }, [
      editor,
      onDrawingChange,
      onDrawingChange2,
      onDrawingChange3,
      onDrawingChange4,
    ]);

    return (
      <HTMLContainer>
        <div>
          {component}
          <div
            style={{
              display: "flex",
              flexFlow: "row wrap",
              position: "relative",
              left: shape.props.w,
              width: shape.props.w * 2,
            }}
          >
            {image && (
              <img
                src={image}
                alt=""
                width={shape.props.w}
                height={shape.props.h}
                style={{
                  width: shape.props.w,
                  height: shape.props.h,
                }}
              />
            )}
            {image2 && (
              <img
                src={image2}
                alt=""
                width={shape.props.w}
                height={shape.props.h}
                style={{
                  width: shape.props.w,
                  height: shape.props.h,
                }}
              />
            )}
            {image3 && (
              <img
                src={image3}
                alt=""
                width={shape.props.w}
                height={shape.props.h}
                style={{
                  width: shape.props.w,
                  height: shape.props.h,
                }}
              />
            )}
            {image4 && (
              <img
                src={image4}
                alt=""
                width={shape.props.w}
                height={shape.props.h}
                style={{
                  width: shape.props.w,
                  height: shape.props.h,
                }}
              />
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }
}
