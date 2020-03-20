import * as React from 'react';
import { FormGroup, Input, Label, Row, Col } from 'reactstrap';
import { Bitrate, BitrateUnit, bitrateToNumber } from '../Bitrate';
import { mapChangeEv } from '../MapChangeEv';

const initialBitrate: Bitrate = {
  value: 0,
  unit: 'KiB/s',
};

interface CustomProps {
  bitrate: Bitrate;
  onChange: (br: Bitrate) => void;
}

const ThrottleCustom: React.FC<CustomProps> = ({ bitrate, onChange }) => {
  const onChangeValue = (value: string) => {
    const n = parseInt(value, 10);
    if (isNaN(n)) onChange({ value: 0, unit: bitrate.unit });

    onChange({ value: n, unit: bitrate.unit });
  };

  const onChangeUnit = (unit: BitrateUnit) =>
    onChange({ value: bitrate.value, unit });

  return (
    <Row form>
      <Col sm={8} xs={6}>
        <FormGroup>
          <Input
            type="number"
            value={bitrate.value}
            onChange={mapChangeEv(onChangeValue)}
          />
        </FormGroup>
      </Col>
      <Col sm={4} xs={6}>
        <FormGroup>
          <Input
            type="select"
            value={bitrate.unit}
            onChange={mapChangeEv<BitrateUnit>(onChangeUnit)}
          >
            <option value="KiB/s">KiB/s</option>
            <option value="MiB/s">MiB/s</option>
            <option value="GiB/s">GiB/s</option>
          </Input>
        </FormGroup>
      </Col>
    </Row>
  );
};

export type Throttle =
  | { type: 'GLOBAL' }
  | { type: 'UNLIMITED' }
  | { type: 'CUSTOM'; bitrate: Bitrate };

export const throttleToNumber = (throttle: Throttle): number | null => {
  switch (throttle.type) {
    case 'GLOBAL':
      return null;
    case 'UNLIMITED':
      return -1;
    case 'CUSTOM':
      return bitrateToNumber(throttle.bitrate);
  }
};

interface Props {
  title: string;
  throttle: Throttle;
  onChange: (newThrottle: Throttle) => void;
}

export const ThrottleBitrate: React.FC<Props> = ({
  title,
  throttle,
  onChange,
}) => (
  <FormGroup>
    <Label className="d-block">{title}</Label>
    <FormGroup check inline>
      <Label>
        <Input
          type="radio"
          checked={throttle.type === 'GLOBAL'}
          onChange={() => onChange({ type: 'GLOBAL' })}
        />
        Global
      </Label>
    </FormGroup>
    <FormGroup check inline>
      <Label>
        <Input
          type="radio"
          checked={throttle.type === 'UNLIMITED'}
          onChange={() => onChange({ type: 'UNLIMITED' })}
        />
        Unlimited
      </Label>
    </FormGroup>
    <FormGroup check inline>
      <Label>
        <Input
          type="radio"
          checked={throttle.type === 'CUSTOM'}
          onChange={() => onChange({ type: 'CUSTOM', bitrate: initialBitrate })}
        />
        Custom
      </Label>
    </FormGroup>
    {throttle.type === 'CUSTOM' && (
      <ThrottleCustom
        bitrate={throttle.bitrate}
        onChange={(bitrate) => onChange({ type: 'CUSTOM', bitrate })}
      />
    )}
  </FormGroup>
);
