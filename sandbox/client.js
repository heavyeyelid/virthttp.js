const axios = require('axios');
const virthttp = require('../index');

let target = 'http://127.0.0.1:8081/'
let params = { headers: { 'X-Auth-Key': 'yourapikey' } };

xml = String.raw`"<domain type='kvm'>
<name>ubuntu18.04</name>
<uuid>1522ffd6-12ad-4c9e-bcf9-695d633c45ec</uuid>
<metadata>
  <libosinfo:libosinfo xmlns:libosinfo='http://libosinfo.org/xmlns/libvirt/domain/1.0'>
    <libosinfo:os id='http://ubuntu.com/ubuntu/18.04'/>
  </libosinfo:libosinfo>
</metadata>
<memory unit='KiB'>4194304</memory>
<currentMemory unit='KiB'>4194304</currentMemory>
<vcpu placement='static'>4</vcpu>
<os>
  <type arch='x86_64' machine='pc-q35-2.11'>hvm</type>
  <loader readonly='yes' type='pflash'>/usr/share/OVMF/OVMF_CODE.fd</loader>
  <nvram>/var/lib/libvirt/qemu/nvram/ubuntu18.04_VARS.fd</nvram>
  <boot dev='hd'/>
</os>
<features>
  <acpi/>
  <apic/>
  <vmport state='off'/>
</features>
<cpu mode='host-model' check='partial'>
  <model fallback='allow'/>
  <topology sockets='1' cores='4' threads='1'/>
</cpu>
<clock offset='utc'>
  <timer name='rtc' tickpolicy='catchup'/>
  <timer name='pit' tickpolicy='delay'/>
  <timer name='hpet' present='no'/>
</clock>
<on_poweroff>destroy</on_poweroff>
<on_reboot>restart</on_reboot>
<on_crash>destroy</on_crash>
<pm>
  <suspend-to-mem enabled='no'/>
  <suspend-to-disk enabled='no'/>
</pm>
<devices>
  <emulator>/usr/bin/kvm-spice</emulator>
  <disk type='file' device='disk'>
    <driver name='qemu' type='qcow2'/>
    <source file='/var/lib/libvirt/images/ubuntu18.04.qcow2'/>
    <target dev='vda' bus='virtio'/>
    <address type='pci' domain='0x0000' bus='0x03' slot='0x00' function='0x0'/>
  </disk>
  <controller type='usb' index='0' model='ich9-ehci1'>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1d' function='0x7'/>
  </controller>
  <controller type='usb' index='0' model='ich9-uhci1'>
    <master startport='0'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1d' function='0x0' multifunction='on'/>
  </controller>
  <controller type='usb' index='0' model='ich9-uhci2'>
    <master startport='2'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1d' function='0x1'/>
  </controller>
  <controller type='usb' index='0' model='ich9-uhci3'>
    <master startport='4'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1d' function='0x2'/>
  </controller>
  <controller type='sata' index='0'>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1f' function='0x2'/>
  </controller>
  <controller type='pci' index='0' model='pcie-root'/>
  <controller type='pci' index='1' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='1' port='0x10'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x0' multifunction='on'/>
  </controller>
  <controller type='pci' index='2' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='2' port='0x11'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x1'/>
  </controller>
  <controller type='pci' index='3' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='3' port='0x12'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x2'/>
  </controller>
  <controller type='pci' index='4' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='4' port='0x13'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x3'/>
  </controller>
  <controller type='pci' index='5' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='5' port='0x14'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x4'/>
  </controller>
  <controller type='pci' index='6' model='pcie-root-port'>
    <model name='pcie-root-port'/>
    <target chassis='6' port='0x15'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x02' function='0x5'/>
  </controller>
  <controller type='virtio-serial' index='0'>
    <address type='pci' domain='0x0000' bus='0x02' slot='0x00' function='0x0'/>
  </controller>
  <interface type='network'>
    <mac address='52:54:00:84:ac:11'/>
    <source network='default'/>
    <model type='virtio'/>
    <address type='pci' domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
  </interface>
  <serial type='pty'>
    <target type='isa-serial' port='0'>
      <model name='isa-serial'/>
    </target>
  </serial>
  <console type='pty'>
    <target type='serial' port='0'/>
  </console>
  <channel type='unix'>
    <target type='virtio' name='org.qemu.guest_agent.0'/>
    <address type='virtio-serial' controller='0' bus='0' port='1'/>
  </channel>
  <channel type='spicevmc'>
    <target type='virtio' name='com.redhat.spice.0'/>
    <address type='virtio-serial' controller='0' bus='0' port='2'/>
  </channel>
  <input type='tablet' bus='usb'>
    <address type='usb' bus='0' port='1'/>
  </input>
  <input type='mouse' bus='ps2'/>
  <input type='keyboard' bus='ps2'/>
  <graphics type='spice' autoport='yes'>
    <listen type='address'/>
  </graphics>
  <sound model='ich9'>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x1b' function='0x0'/>
  </sound>
  <video>
    <model type='qxl' ram='65536' vram='65536' vgamem='16384' heads='1' primary='yes'/>
    <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
  </video>
  <redirdev bus='usb' type='spicevmc'>
    <address type='usb' bus='0' port='2'/>
  </redirdev>
  <redirdev bus='usb' type='spicevmc'>
    <address type='usb' bus='0' port='3'/>
  </redirdev>
  <memballoon model='virtio'>
    <address type='pci' domain='0x0000' bus='0x04' slot='0x00' function='0x0'/>
  </memballoon>
  <rng model='virtio'>
    <backend model='random'>/dev/urandom</backend>
    <address type='pci' domain='0x0000' bus='0x05' slot='0x00' function='0x0'/>
  </rng>
</devices>
</domain>
"`;

xml = xml.split('\n');
let str = '';
xml.forEach(row => {
    str += row
});

let req = virthttp.req(target, params).libvirt().domain().create(str);
if (req.state !== 'ready')
    console.log(`error: ${req.err_msg}`);
else
    req().then(res => {
        console.log(`Data sent: \n${res.config.data}`)
        console.log('Result: ');
        console.log(res.data);
    }).catch(err => console.error(err));

let req2 = virthttp.req(target, params).libvirt().domain({ name: 'win10' });
if (req2.state !== 'ready')
    console.log(`error: ${req2.err_msg}`);
else
    req2().then(res => {
        console.table(res.data);
    }).catch(err => console.error(err));

let req3 = virthttp.req(target, params).libvirt().domains();
if (req3.state !== 'ready')
    console.log(`error: ${req3.err_msg}`);
else
    req3().then(res => {
        console.table(res.data);
    }).catch(err => console.error(err));
