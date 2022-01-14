using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace example_contract
{
    public interface IAnalogValueControl
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> RampUpValue;
        event EventHandler<UIEventArgs> RampDownValue;
        event EventHandler<UIEventArgs> SetValuePresetValue1;
        event EventHandler<UIEventArgs> SetValuePresetValue2;
        event EventHandler<UIEventArgs> SetValuePresetValue3;
        event EventHandler<UIEventArgs> SetValue;

        void Value(AnalogValueControlUShortInputSigDelegate callback);

    }

    public delegate void AnalogValueControlBoolInputSigDelegate(BoolInputSig boolInputSig, IAnalogValueControl analogValueControl);
    public delegate void AnalogValueControlUShortInputSigDelegate(UShortInputSig uShortInputSig, IAnalogValueControl analogValueControl);

    internal class AnalogValueControl : IAnalogValueControl, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint RampUpValue = 1;
                public const uint RampDownValue = 2;
                public const uint SetValuePresetValue1 = 3;
                public const uint SetValuePresetValue2 = 4;
                public const uint SetValuePresetValue3 = 5;

            }
            internal static class Numerics
            {
                public const uint SetValue = 1;

                public const uint Value = 1;
            }
        }

        #endregion

        #region Construction and Initialization

        internal AnalogValueControl(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.RampUpValue, onRampUpValue);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.RampDownValue, onRampDownValue);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.SetValuePresetValue1, onSetValuePresetValue1);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.SetValuePresetValue2, onSetValuePresetValue2);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.SetValuePresetValue3, onSetValuePresetValue3);
            ComponentMediator.ConfigureNumericEvent(controlJoinId, Joins.Numerics.SetValue, onSetValue);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> RampUpValue;
        private void onRampUpValue(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = RampUpValue;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> RampDownValue;
        private void onRampDownValue(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = RampDownValue;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> SetValuePresetValue1;
        private void onSetValuePresetValue1(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = SetValuePresetValue1;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> SetValuePresetValue2;
        private void onSetValuePresetValue2(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = SetValuePresetValue2;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> SetValuePresetValue3;
        private void onSetValuePresetValue3(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = SetValuePresetValue3;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public event EventHandler<UIEventArgs> SetValue;
        private void onSetValue(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = SetValue;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void Value(AnalogValueControlUShortInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].UShortInput[Joins.Numerics.Value], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "AnalogValueControl", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            RampUpValue = null;
            RampDownValue = null;
            SetValuePresetValue1 = null;
            SetValuePresetValue2 = null;
            SetValuePresetValue3 = null;
            SetValue = null;
        }

        #endregion

    }
}
