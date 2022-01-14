using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace example_contract
{
    public interface IPage1
    {
        object UserObject { get; set; }

        example_contract.IJoinToggle JoinToggle { get; }
        example_contract.IAnalogValueControl AnalogValueControl { get; }
        example_contract.ITextInputValue TextInputValue { get; }
    }

    internal class Page1 : IPage1, IDisposable
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
        }

        #endregion

        #region Construction and Initialization

        internal Page1(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            JoinToggle = new example_contract.JoinToggle(ComponentMediator, 2);

            AnalogValueControl = new example_contract.AnalogValueControl(ComponentMediator, 3);

            TextInputValue = new example_contract.TextInputValue(ComponentMediator, 4);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
            ((example_contract.JoinToggle)JoinToggle).AddDevice(device);
            ((example_contract.AnalogValueControl)AnalogValueControl).AddDevice(device);
            ((example_contract.TextInputValue)TextInputValue).AddDevice(device);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
            ((example_contract.JoinToggle)JoinToggle).RemoveDevice(device);
            ((example_contract.AnalogValueControl)AnalogValueControl).RemoveDevice(device);
            ((example_contract.TextInputValue)TextInputValue).RemoveDevice(device);
        }

        #endregion

        #region CH5 Contract

        public example_contract.IJoinToggle JoinToggle { get; private set; }

        public example_contract.IAnalogValueControl AnalogValueControl { get; private set; }

        public example_contract.ITextInputValue TextInputValue { get; private set; }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "Page1", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            ((example_contract.JoinToggle)JoinToggle).Dispose();
            ((example_contract.AnalogValueControl)AnalogValueControl).Dispose();
            ((example_contract.TextInputValue)TextInputValue).Dispose();
        }

        #endregion

    }
}
