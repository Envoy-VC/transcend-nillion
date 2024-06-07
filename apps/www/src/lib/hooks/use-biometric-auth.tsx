import { useEffect, useState } from 'react';

import * as faceApi from 'face-api.js';
import { useLocalStorage } from 'usehooks-ts';

export const useBiometricAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [descriptor, setDescriptor] = useLocalStorage<string>(
    'descriptor',
    []
  );

  const loadModels = async () => {
    try {
      console.log('Loading models...');
      setIsLoading(true);
      await faceApi.nets.ssdMobilenetv1.loadFromUri('/models/ssd_mobilenetv1');
      await faceApi.nets.tinyFaceDetector.loadFromUri(
        '/models/tiny_face_detector'
      );
      await faceApi.nets.faceLandmark68Net.loadFromUri(
        '/models/face_landmark_68'
      );
      await faceApi.nets.faceRecognitionNet.loadFromUri(
        '/models/face_recognition'
      );
      await faceApi.nets.faceExpressionNet.loadFromUri(
        '/models/face_expression'
      );

      setLoaded(true);
      setIsLoading(false);
      console.log('Models loaded');
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadModels();
  }, []);

  const getDescriptors = async (image: string) => {
    const imageElement = document.createElement('img');
    imageElement.src = image;
    await imageElement.decode();
    const res = await faceApi
      .detectSingleFace(imageElement, new faceApi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!res) {
      throw new Error('No face detected');
    }

    const { descriptor } = res;
    return Array.from(descriptor).map((e) => Math.round(e * 1000));
  };

  return {
    isModelsLoading: isLoading,
    modelsLoaded: loaded,
    getDescriptors,
    descriptor,
    setDescriptor,
  };
};
